const express = require("express");
const router = express.Router();
const articleController = require("../../controllers/article.controller");

router.get("/", articleController.getArticles);
router.get("/:userId", articleController.getArticleByUserId);
router.post("/create", articleController.createArticle);
router.patch("/update/:articleId", articleController.updateArticle);
router.delete("/delete/:articleId", articleController.deleteArticle);

module.exports = router;