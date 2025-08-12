const express = require("express");
const { UserController } = require("../controller");
const { isAuthenticated } = require("../middleware/auth");
const router = express.Router();
router.use(isAuthenticated);
/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Fetch the single user details.
 *     security: 
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the user.
 *     responses:  
 *       200:
 *         description: Successfully Fetch User Details.
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: johandoe
 *                 email:
 *                   type: string
 *                   example: johan@gmail.com
 *                 role:
 *                   type: string
 *                   example: User     
 *       404:
 *         description: User not found with give ID.
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User Not Found.       
 *       
 */
router.get("/:id", UserController.getUser);
router.get("/", UserController.getUsers);
/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Create User.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string 
 *                 example: user-1
 *               email:
 *                 type: string
 *                 example: api@mail.com
 *               role:
 *                 type: string
 *                 example: User
 *               password:
 *                 type: string
 *                 example: "******"                   
 *     responses:
 *       200:
 *         description: Successfully User Created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: swt
 *                 email:
 *                   type: string
 *                   example: swt@gmail.com
 *                 role:
 *                   type: string
 *                   example: User  
 * 
 */
router.post("/", UserController.createUser);
/**
 * @swagger
 * /api/v1/users/{id}:
 *   patch:
 *     summary: Update User.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the User
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string 
 *                 example: user-1
 *               email:
 *                 type: string
 *                 example: api@mail.com
 *               role:
 *                 type: string
 *                 example: User
 *               password:
 *                 type: string
 *                 example: "******"                   
 *     responses:
 *       200:
 *         description: Successfully User Created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: swt
 *                 email:
 *                   type: string
 *                   example: swt@gmail.com
 *                 role:
 *                   type: string
 *                   example: User  
 *       401:
 *         description: UnAuthorized Request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access Invalid  
 *       403:
 *         description: Permission not Granted Request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access Invalid  
 * 
 *                  
 * 
 */
router.patch("/:id", UserController.updateUser);
router.patch("/psw/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

module.exports = router;
