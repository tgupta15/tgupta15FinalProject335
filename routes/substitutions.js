const express = require("express");
const axios = require("axios");
const SavedSubstitution = require("../models/SavedSubstitution");

const router = express.Router();

router.get("/", (req, res) => {
    res.render("index");
});


router.post("/substitutions", async (req, res) => {
    const ingredientName = req.body.ingredientName;

    if (!ingredientName) {
        return res.render("results", {
            ingredientName: "",
            substitutes: [],
            error: "Please enter an ingredient name."
        });
    }

    try {
        const apiKey = process.env.SPOONACULAR_API_KEY;
        const url = "https://api.spoonacular.com/food/ingredients/substitutes";

        const response = await axios.get(url, {
            params: {
                apiKey,
                ingredientName
            }
        });


        const data = response.data;

        const substitutes = Array.isArray(data.substitutes)
            ? data.substitutes
            : [];

        res.render("results", {
            ingredientName,
            substitutes,
            error: substitutes.length === 0 ? "No substitutions found." : null
        });
    } catch (err) {
        console.error("Error calling Spoonacular API:", err.message);
        res.render("results", {
            ingredientName,
            substitutes: [],
            error: "There was a problem fetching substitutions. Please try again."
        });
    }
});

router.post("/saved", async (req, res) => {
    const { ingredientName, substitutionText } = req.body;

    if (!ingredientName || !substitutionText) {
        return res.redirect("/saved");
    }

    try {
        await SavedSubstitution.create({
            ingredientName,
            substitutionText
        });

        res.redirect("/saved");
    } catch (err) {
        console.error("Error saving substitution:", err.message);
        res.redirect("/saved");
    }
});


router.get("/saved", async (req, res) => {
    try {
        const saved = await SavedSubstitution.find({})
            .sort({ createdAt: -1 })
            .lean();

        res.render("saved", { saved });
    } catch (err) {
        console.error("Error retrieving saved substitutions:", err.message);
        res.render("saved", { saved: [] });
    }
});


router.post("/saved/deleteAll", async (req, res) => {
    try {
        await SavedSubstitution.deleteMany({});
        res.redirect("/saved");
    } catch (err) {
        console.error("Error deleting all substitutions:", err.message);
        res.redirect("/saved");
    }
});

module.exports = router;
