const { Article } = require("../models/index");

module.exports = {
  getArticles: async (req, res) => {
    try {
      const articles = await Article.findAll();

      if (!articles) {
        return res.status(404).json({
          success: false,
          message: "Articles not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Get articles successfully",
        data: articles,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Get articles failed",
        errors: error.message,
      });
    }
  },
  createArticle: async (req, res) => {
    try {
      const { content } = req.body;
      const userId = req.userId;

      if (!content) {
        return res.status(400).json({
          success: false,
          message: "Content is required",
        });
      }

      const newArticle = await Article.create({
        content,
        user_id: userId,
      });

      res.status(200).json({
        success: true,
        message: "Create article successfully",
        data: newArticle,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Create article failed",
        errors: error.message,
      });
    }
  },
  updateArticle: async (req, res) => {
    try {
      const articleId = req.params.articleId;
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({
          success: false,
          message: "Content is required",
        });
      }

      const updatedArticle = await Article.update(
        { content },
        { where: { id: articleId } },
      );

      if (!updatedArticle) {
        return res.status(404).json({
          success: false,
          message: "Article not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Update article successfully",
        data: updatedArticle,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Update article failed",
        errors: error.message,
      });
    }
  },
  getArticleByUserId: async (req, res) => {
    try {
      const userId = req.params.userId;
      const articles = await Article.findAll({ where: { user_id: userId } });

      if (!articles) {
        return res.status(404).json({
          success: false,
          message: "Articles not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Get articles successfully",
        data: articles,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Get articles by user failed",
        errors: error.message,
      });
    }
  },
  deleteArticle: async (req, res) => {
    try {
      const articleId = req.params.articleId;
      const deletedArticle = await Article.destroy({
        where: { id: articleId },
      });

      if (!deletedArticle) {
        return res.status(404).json({
          success: false,
          message: "Article not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Delete article successfully",
        data: deletedArticle,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Delete article failed",
        errors: error.message,
      });
    }
  }
};
