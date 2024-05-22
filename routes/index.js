const { Router } = require("express");
const router = Router();

router.use("/auth", require("./auth"));
router.use("/watchlist", require("./watchlist"));
router.use("/suggestions", require("./suggestions"));

module.exports = router;
