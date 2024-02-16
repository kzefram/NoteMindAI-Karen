// Import Router from express and models from the database
const router = require('express').Router();
// Import Users model from the models directory
const { Users } = require('../../models');


// GET route to retrieve all users
router.get('/', async (req, res) => {
  // console.log("Hit request to http://localhost:3000/api/users"); // TODO: comment
  try {
    const userData = await Users.findAll();
    // Send back the category data with status code 200 (OK)
    res.status(200).json(userData);
  } catch (err) {
    // If an error occurs, send back the error with status code 500 (Internal Server Error)
    console.log(err);
    res.status(500).json(err);
  }
});


// GET route to find a single user by ID
router.get('/:id', async (req, res) => {
  try {
    const userData = await Users.findByPk(req.params.id);
    if (!userData) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }
    res.status(200).json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


// POST route to create a new user
router.post('/', async (req, res) => {
  try {
    const userData = await Users.create(req.body);
    res.status(200).json(userData);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});


// PUT route to update a user's details by ID
router.put('/:id', async (req, res) => {
  try {
    const userData = await Users.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!userData[0]) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }
    res.status(200).json({ message: 'User updated successfully!' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Deletes a user by their unique identifier from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user's ID.
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: No user found with this ID.
 *       500:
 *         description: Internal server error
 */
// DELETE route to remove a user by ID
router.delete('/:id', async (req, res) => {
  try {
    const userData = await Users.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!userData) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }
    res.status(200).json({ message: 'User deleted successfully!' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Export the router to make these routes available
module.exports = router;