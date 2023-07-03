const router = Router();
const indexController = require('../controllers/indexController')

router.get("/", async (req, res) => {
    try {
      const data = await indexController.findAll({
        include: [
          {},
        ]
      })
      res.status(200).json(data)
    } catch (error) {
      console.log(error)
      res.status(200).json(error)
    }
  })
