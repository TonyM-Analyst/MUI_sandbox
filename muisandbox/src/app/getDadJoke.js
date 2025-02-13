"use client";

import { useState, useEffect, useCallback } from "react";
import { 
    Box, Card, CardContent, CardMedia, Typography, Button, 
    Dialog, DialogTitle, DialogContent, Rating, Grid, CircularProgress, Alert 
} from "@mui/material";
import { fetchDadJokes } from "../app/data/api/dadJokeapi"; // Import API fetch function

export default function MemeGallery() {
    const [memes, setMemes] = useState([]); // Stores API data
    const [open, setOpen] = useState(false);
    const [selectedMeme, setSelectedMeme] = useState(null);
    const [ratings, setRatings] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [after, setAfter] = useState(5); // Pagination token for 'after' param
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Fetch memes from API using separate handler
    const getMemes = useCallback(async (loadMore = false) => {
        try {
            const newMemes = await fetchDadJokes(after);
            if (!Array.isArray(newMemes)) throw new Error("Invalid API response");

            setMemes((prev) => loadMore ? [...prev, ...newMemes] : newMemes);
            setRatings((prevRatings) => ({
                ...prevRatings,
                ...newMemes.reduce((acc, meme) => ({ ...acc, [meme.id]: 3 }), {}),
            }));
            setAfter(after + 5); // Increment 'after' for next API call
        } catch (err) {
            setError("Failed to load memes. Try again later.");
            console.error("Error fetching memes:", err);
        } finally {
            setLoading(false);
            setIsLoadingMore(false);
        }
    }, [after]);

    useEffect(() => {
        getMemes();
    }, []);

    // Handle opening the popup
    const handleOpen = (meme) => {
        setSelectedMeme(meme);
        setOpen(true);
    };

    // Handle closing the popup
    const handleClose = () => {
        setOpen(false);
        setSelectedMeme(null);
    };

    // Handle rating change
    const handleRatingChange = (memeId, newRating) => {
        setRatings((prevRatings) => ({
            ...prevRatings,
            [memeId]: newRating
        }));
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>
                🎭 Programming Memes 🎭
            </Typography>

            {/* Loading State */}
            {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <CircularProgress />
                </Box>
            )}

            {/* Error Handling */}
            {error && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            )}

            {/* Meme Grid */}
            <Grid container spacing={3} justifyContent="center">
                {!loading && !error && memes.map((meme) => (
                    <Grid item key={meme.id} xs={12} sm={6} md={4}>
                        <MemeCard 
                            meme={meme} 
                            rating={ratings[meme.id] || 3} 
                            onRateChange={handleRatingChange} 
                            onOpen={handleOpen} 
                        />
                    </Grid>
                ))}
            </Grid>

            {/* Load More Button */}
            {memes.length > 0 && !loading && (
                <Box sx={{ textAlign: "center", mt: 4 }}>
                    <Button 
                        variant="contained" 
                        color="secondary" 
                        onClick={() => {
                            setIsLoadingMore(true);
                            getMemes(true);
                        }}
                        disabled={isLoadingMore}
                    >
                        {isLoadingMore ? "Loading..." : "Load More"}
                    </Button>
                </Box>
            )}

            {/* Meme Details Popup */}
            {selectedMeme && (
                <MemeDialog meme={selectedMeme} open={open} onClose={handleClose} />
            )}
        </Box>
    );
}

/** 🎭 Meme Card Component */
function MemeCard({ meme, rating, onRateChange, onOpen }) {
    return (
        <Card sx={{ maxWidth: 400, textAlign: "center", boxShadow: 3 }}>
            <CardMedia
                component="img"
                height="300"
                image={meme.media}
                alt={meme.title}
            />
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {meme.title}
                </Typography>

                {/* Rating Component */}
                <Rating
                    name={`rating-${meme.id}`}
                    value={rating}
                    onChange={(event, newValue) => onRateChange(meme.id, newValue)}
                />

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => onOpen(meme)}
                >
                    View Meme
                </Button>
            </CardContent>
        </Card>
    );
}

/** 😂 Meme Dialog (Popup) Component */
function MemeDialog({ meme, open, onClose }) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{meme.title}</DialogTitle>
            <DialogContent>
                <Box sx={{ textAlign: "center" }}>
                    <img 
                        src={meme.media} 
                        alt={meme.title} 
                        style={{ width: "100%", borderRadius: "8px" }} 
                    />
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Source: <a href={meme.sourceUrl} target="_blank" rel="noopener noreferrer">{meme.sourceUrl}</a>
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
