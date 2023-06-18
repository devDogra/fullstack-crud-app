const router = require('express').Router(); 

router.get('/', async (req, res, next) => {
    const users = await getUsersFromDatabase();
    res.json(users);
})

router.post('/', async (req, res, next) => {
    const userData = req.body; 
    const createdUser = await createNewUserInDatabase(userData);
    res.json(createdUser);
})

router.patch('/:userId', async (req, res, next) => {
    const data = req.body; 
    const updatedUser = await partiallyUpdateUserInDatabase(req.params.userId, data);
    res.json(updatedUser);
})

router.put('/:userId', async (req, res, next) => {
    const data = req.body; 
    const updatedUser = await updateUserInDatabase(req.params.userId, data); 
    res.json(updatedUser);
})

router.delete('/:userId', async (req, res, next) => {
    const id = req.params.userId; 
    const deletedUser = await deleteUserInDatabase(id);
    res.json(deletedUser);
})

module.exports = router; 
