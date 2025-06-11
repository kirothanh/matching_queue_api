const { Match, Stadium, Club, User } = require("../models/index");

const getMatchesQueueRedisByID = async (id, redis) => {
  const listMatchQueueRedis = await redis.getMatchQueue(id)

  const listUserMatch = await Promise.all(
    listMatchQueueRedis.map(async (userData) => {
      try {
        const { userId, clubId } = JSON.parse(userData);
        const clubPartner = await Club.findOne({
          where: {
            id: clubId,
            createdBy: userId
          },
          attributes: ["id", "name", "imageUrl", "createdBy"],
        })
        return clubPartner || null;
      } catch (error) {
        // Just userId
        const clubPartner = await Club.findOne({
          where: { createdBy: userData },
          attributes: ["id", "name", "imageUrl", "createdBy"],
        })
        return clubPartner || null;
      }
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
  getMatchDetail: async (req, res) => {
    try {
      const redis = req.redis;
      const { id: matchId } = req.params;

      const match = await Match.findOne({
        where: { id: matchId },
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

      if (!match) {
        return res.status(404).json({
          success: false,
          message: "Match not found",
        });
      }

      const usersJoin = await getMatchesQueueRedisByID(match.id, redis);

      res.status(200).json({
        success: true,
        message: "Get matches successfully",
        data: {
          ...match.toJSON(),
          usersJoin,
        },
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
  deleteMatchByUser: async (req, res) => {
    try {
      const { matchId } = req.params;
      const result = await Match.destroy({
        where: { id: matchId }
      });

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Match not found"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Delete match successfully"
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Delete match failed"
      });
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
      const { id: matchId, partner_id: partnerId, club_id: clubId } = req.body;


      if (!matchId || !partnerId || !clubId) {
        return res.status(400).json({
          success: false,
          message: "Match ID, Partner ID and Club ID are required",
        });
      }

      const partnerClub = await Club.findOne({
        where: {
          id: clubId,
          createdBy: partnerId
        }
      })

      if (!partnerClub) {
        return res.status(404).json({
          success: false,
          message: "Club not found or you don't have permission to use this club",
        });
      }

      const existingMatch = await Match.findOne({ where: { id: matchId, createdBy: partnerId } });

      if (existingMatch) {
        return res.status(403).json({
          success: false,
          message: "You can't join match by you created",
        });
      }

      const currentMatchQueue = await redis.getMatchQueue(matchId)

      const isPartnerInQueue = currentMatchQueue.find((userData) => {
        const { userId } = JSON.parse(userData);
        return userId === partnerId.toString();
      })

      if (isPartnerInQueue) {
        return res.status(409).json({
          success: false,
          message: "You already exists in the match.",
        });
      }

      // Store both userId and clubId in Redis
      const userData = JSON.stringify({
        userId: partnerId.toString(),
        clubId: clubId
      });

      await redis.pushMatchQueue(matchId, userData);
      const updatedMatchQueue = await redis.getMatchQueue(matchId)

      const matchParticipants = await Promise.all(
        updatedMatchQueue.map(async (userData) => {
          const { userId, clubId } = JSON.parse(userData);
          const participantClub = await Club.findOne({
            where: {
              id: clubId,
              createdBy: userId
            },
            attributes: ["id", "name", "imageUrl", "createdBy"],
          })
          return participantClub;
        })
      )

      _io.to(`match_${matchId}`).emit("userJoined", {
        message: `A new user joined the match!`,
        matchId: matchId,
        users: matchParticipants
      })

      return res.status(200).json({
        success: true,
        message: "Joined match successfully",
        matchParticipants
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
