const userRoutes = require("./user");
const roleRoutes = require("./role")
const AccessRoutes = require("./access")
const ModelRoutes = require("./models")
const features = require("./feature")
const express = require("express")
const router = express.Router()

router.use(userRoutes);
router.use(roleRoutes);
router.use(AccessRoutes);
router.use(ModelRoutes);
router.use(features)

module.exports = router