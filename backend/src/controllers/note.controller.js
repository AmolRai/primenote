import { Note } from "../models/note.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { nanoid } from "nanoid";

const addNote = async (req, res) => {
  try {
    const { title, isPublic, pinNote, filterNotes } = req.body;

    if (!title) {
      throw new ApiError(400, "Title is required");
    }

    const publicIdentifier = nanoid();

    const newNote = new Note({
      title,
      userId: req.user._id,
      isPublic: isPublic,
      publicIdentifier: publicIdentifier,
      pinNote: pinNote || false,
    });

    await newNote.save();

    if (!newNote) {
      throw new ApiError(500, "Something went wrong while creating a notes");
    }

    const user = await User.findById(req.user._id);
    user.notes.push(newNote._id);
    await user.save();

    return res
      .status(201)
      .json(new ApiResponse(201, newNote, "Notes Saved Successfully"));
  } catch (err) {
    console.log("addNote Error:", err.message);
  }
};

const fetchAllNotes = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean().populate("notes");

    if (!user) {
      throw new ApiError("404", "User not found");
    }

    const userNotes = user.notes || [];

    return res
      .status(201)
      .json(new ApiResponse(201, userNotes, "Successfully fetched user notes"));
  } catch (err) {
    console.log("fetchAllNotes Error:", err.message);
  }
};

const updateNote = async (req, res) => {
  const { id, title, pinNote } = req.body;
  console.log("ID:", id);
  try {
    const note = await Note.findByIdAndUpdate(
      id,
      {
        $set: {
          title: title,
          pinNote: pinNote,
        },
      },
      { new: true }
    );

    if (!note) {
      throw new ApiError(400, "Note not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, note, "Note updated successfully"));
  } catch (error) {
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json(new ApiError(400, "Invalid note Id"));
    }

    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

const updateCompleteNote = async (req, res) => {
  try {
    const { id, isComplete } = req.body;

    const noteToUpdate = await Note.findByIdAndUpdate(
      id,
      {
        $set: {
          isComplete: isComplete,
        },
      },
      { new: true }
    );

    if (!noteToUpdate) {
      throw new ApiError(400, "Note not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, noteToUpdate, "Note updated successfully"));
  } catch (err) {
    console.log("UpdateCompleteNote Error:", err.message);
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { notes: id } },
      { new: true }
    ).lean();

    if (!updatedUser) {
      throw new ApiError(404, "Error: User Note Delete ");
    }

    await Note.deleteOne({ _id: id });

    return res
      .status(200)
      .json(new ApiResponse(200, "Note deleted successfully"));
  } catch (error) {
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json(new ApiError(400, "Invalid note Id"));
    }

    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

const viewNote = async (req, res) => {
  try {
    const { publicIdentifier } = req.params;
    const note = await Note.findOne({ publicIdentifier });
    if (!note) {
      throw new ApiError(400, "Bad Request");
    }

    if (note.isPublic) {
      return res.status(200).json(new ApiResponse(200, note, "Public Note"));
    }

    // change the status code
    return res
      .status(200)
      .json(
        new ApiResponse(200, { isPublic: note.isPublic }, "Note is not public")
      );
  } catch (err) {
    console.log("viewNote Error:", err.message);
  }
};

const publicNote = async (req, res) => {
  try {
    const { publicIdentifier, isPublic } = req.body;
    const note = await Note.findOne({ publicIdentifier });

    if (!note) {
      throw new ApiError(400, "Public Note not found");
    }

    note.isPublic = isPublic;
    await note.save();

    if (!isPublic) {
      return res
        .status(200)
        .json(new ApiResponse(200, note, "Note becomes unpublic"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, note, "Note becomes public"));
  } catch (err) {
    console.log("publicNote Error:", err.message);
  }
};

export {
  addNote,
  fetchAllNotes,
  updateNote,
  deleteNote,
  updateCompleteNote,
  viewNote,
  publicNote,
};
