const { Match, Stadium, Club, User } = require("../models/index");

const getMatchesQueueRedisByID = async (id, redis) => {
  const listMatchQueueRedis = await redis.getMatchQueue(id)

  const listUserMatch = await Promise.all(
    listMatchQueueRedis.map(async (userMatch) => {
      const clubPartner = await Club.findOne({
        where: { createdBy: userMatch },
        // attributes: ["imageUrl"],
      })
      return clubPartner || null;
    })
  )

  return listUserMatch;
}

module.exports = {
  getMatches: async (req, res) => {
    try {
      const redis = req.redis;
      const matches = await Match.findAll({
        include: [
          {
            model: Stadium,
            as: "stadium",
            attributes: ["id", "name"],
          },
          {
            model: Club,
            as: "club",
            attributes: ["id", "name", "imageUrl"],
          },
          {
            model: User,
            as: "creator",
            attributes: ["id", "name"],
          },
        ]
      });

      if (!matches) {
        return res.status(404).json({
          success: false,
          message: "Matches not found",
        });
      }

      const userJoinMatches = await Promise.all(
        matches.map(async (match) => {
          const userJoinMatch = await getMatchesQueueRedisByID(match.id, redis)
          // console.log('userJoinMatch: ', userJoinMatch)
          return {
            ...match.toJSON(),
            usersJoin: userJoinMatch
          }
        })
      )

      res.status(200).json({
        success: true,
        message: "Get matches successfully",
        data: userJoinMatches,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Get matches failed",
        errors: error.message,
      });
    }
  },
  manageMatchesByUser: async (req, res) => {
    try {
      const userId = req.userId;

      const matchesByUser = await Match.findAll({
        where: {
          createdBy: userId
        },
        include: [
          {
            model: Stadium,
            as: "stadium",
            attributes: ["name"],
          },
          {
            model: Club,
            as: "club",
            attributes: ["name", "imageUrl"],
          },
        ]
      })

      if (!matchesByUser) {
        return res.status(404).json({
          success: false,
          message: "Matches by user not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Get matches by user successfully",
        matchesByUser
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Get matches by user failed"
      })
    }
  },
  createMatch: async (req, res) => {
    const userId = req.userId;

    try {
      const {
        stadium_id,
        club_id,
        matchDate,
        matchTime,
        contactNumber,
        description,
      } = req.body;

      console.log(req.body);

      if (
        !stadium_id ||
        !club_id ||
        !matchDate ||
        !matchTime ||
        !contactNumber
      ) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      const newMatch = {
        stadium_id: parseInt(stadium_id, 10),
        club_id: parseInt(club_id, 10),
        matchDate,
        matchTime,
        contactNumber,
        createdBy: userId,
        description,
      };

      const createdMatch = await Match.create(newMatch);

      if (!createdMatch) {
        return res.status(500).json({
          success: false,
          message: "Create match failed",
        });
      }

      const matchWithDetails = await Match.findOne({
        where: { id: createdMatch.id },
        include: [
          {
            model: Stadium,
            as: "stadium",
            attributes: ["id", "name"],
          },
          {
            model: Club,
            as: "club",
            attributes: ["id", "name", "imageUrl"],
          },
          {
            model: User,
            as: "creator",
            attributes: ["id", "name"],
          },
        ],
      });

      res.status(201).json({
        success: true,
        message: "Create match successfully",
        data: matchWithDetails,
      });

    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  joinMatch: async (req, res) => {
    try {
      const redis = req.redis;
      const { id, partner_id } = req.body;

      if (!id || !partner_id) {
        return res.status(400).json({
          success: false,
          message: "Failed to join match",
        });
      }

      // Kiem tra da co club chua
      const clubPartner = await Club.findOne({ where: { createdBy: partner_id } })

      if (!clubPartner) {
        return res.status(404).json({
          success: false,
          message: "You need to create club before join",
        });
      }

      // Kiem tra nguoi do co phai tao tran khong
      // - Tim match bằng cái match_id truyền lên
      // - CreatedBy có băng partnerId hay ko
      const match = await Match.findOne({ where: { id: id, createdBy: partner_id } });

      if (match) {
        return res.status(403).json({
          success: false,
          message: "You can't join match by you created",
        });
      }

      const oldListUserMatch = await redis.getMatchQueue(id)

      const findExistPartner = oldListUserMatch.find((partner) => partner === partner_id.toString())

      if (findExistPartner) {
        return res.status(409).json({
          success: false,
          message: "You already exists in the match.",
        });
      }

      await redis.pushMatchQueue(id, partner_id.toString());
      const newListUserMatch = await redis.getMatchQueue(id)

      const listUserMatch = await Promise.all(
        newListUserMatch.map(async (userMatch) => {
          const clubPartner = await Club.findOne({
            where: { createdBy: userMatch },
          })
          return clubPartner;
        })
      )

      _io.to(`match_${id}`).emit("userJoined", {
        message: `A new user joined the match!`,
        matchId: id,
        users: listUserMatch
      })

      return res.status(200).json({
        success: true,
        message: "Joined match successfully",
        listUserMatch
      })

    } catch (error) {
      console.log('err: ', error)
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  confirmPartnerInMatch: async (req, res) => {
    try {
      const { partnerId, matchId } = req.body;

      if (!partnerId || !matchId) {
        return res.status(404).json({
          success: false,
          message: "partnerID or matchId need"
        })
      }

      const [updatedRows] = await Match.update(
        {
          partner_id: partnerId
        },
        {
          where: { id: matchId }
        }
      )

      if (updatedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Match not found or partner ID already set."
        })
      }

      _io.to(`match_${matchId}`).emit("partnerConfirmed", {
        matchId,
        partnerId,
        message: `Partner has been confirmed match_${matchId}!`
      })

      return res.status(200).json({
        success: true,
        message: "Confirm partner in match successfully"
      })
    } catch (error) {
      console.error('Error updating partnerId in Match:', error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error"
      });
    }
  }
};
