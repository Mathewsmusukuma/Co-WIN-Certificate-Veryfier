import { certificateStatus } from '../verifier/cowinVeryfier';
import express from 'express';

var router = express.Router();

router.post('/', async (req, res, next) => {
    try {
        const payload = req.body;
        console.log(payload); 
        if (payload){
            const response = await certificateStatus(payload);
            console.log(response); 
            res.json({message: response})
        }
    } catch (error) {
      // Passes errors into the error handler
      return next(error)
    }
  })
export default router;