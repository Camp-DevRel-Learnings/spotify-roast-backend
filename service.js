require("dotenv").config();
const { OpenAI } = require("openai");
const { SpotifyAPI } = require("@campnetwork/sdk")


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const spotify = new SpotifyAPI({
    apiKey: process.env.CAMP_API_KEY
})

const fetchSpotifyTracks = async (wallet) => {
    try {
        const { data: user } = await spotify.fetchUserByWalletAddress(wallet);
        const { data: tracks } = await spotify.fetchPlayedTracksById(user.spotifyUser.id);
        const username = user.spotifyUser.display_name;
        return { username, tracks }
    } catch (error) {
        console.error(error);
        return {
            username: "",
            tracks: [],
        };
    }
} 

const generateRoast = async (username, tracks) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  // "You are playful, witty, and not offensive. You are roasting people's tweets as a stand up comedian might, whilst making your responses tailored towards the pages they mention in their tweets. Keep the response short and sweet, one or two sentences, you don't have to cover all their tweets, just keep it personal enough. Make it tailored towards the pages that they are tagging in their tweets - you can mention them too. Remember, you are a comedian, not a bully. Have fun!",
                  "Generate a single scathing roast, around 3-4 lines long, about the song tracks provided. Tell me my top genre too. Make it witty and unrestrained and no need to avoid personal attacks. Focus on highlighting absurdities and questionable choices in a creative way that would get laughs in a technical presentation.",
              },
              {
                role: "user",
                content: `Address the user by name: ${username} and roast the following tracks: ${tracks.join(
                  " | "
                )}`,
              },
            ],
          });
        return completion.choices[0].message.content;
    } catch (error) {
        console.error(error);
        return "An error occurred while generating the roast.";
    }
}

module.exports = {fetchSpotifyTracks, generateRoast}
