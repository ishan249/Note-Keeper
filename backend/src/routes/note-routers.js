const express = require("express");
const Note = require("../models/notes")

const auth = require('../middlewares/auth')

const router = new express.Router();

router.post("/notes/create",auth,async(req,res)=>{
  const note = new Note({
    ...req.body,
    owner:req.user._id,
  });
  try{
    await note.save();
    res.status(201).send({note,message:"note saved"});
  }
  catch(e){
    res.status(500).send(e);
  }

});

router.get("/notes/get",auth,async(req,res)=>{
  try{
    await req.user.populate("notes");
    res.status(200).send(req.user.notes);
  }
  catch(e){
    res.status(500).send(e);
  }
});

router.get("/notes/:id",async(req,res)=>{
  try{
    const note = await Note.findById({_id:req.params.id});
    if(!note){
      res.status(404).send();
    }
    res.send(note);
  }catch(e){
    res.status(500).send(e);
  }
});
router.delete("/notes/:id",async(req,res)=>{
  try{
    const note = await Note.findOneAndDelete({_id:req.params.id});
    if(!note){
      res.status(404).send();
    }
    res.send({message:"note deleted"});
  }
  catch(e){
    res.status(500).send(e);
  }

});
module.exports = router;
