# BentoBox Locations Map Excercise

This exercise requires you to display 25 random BentoBox locations on a map in React.

Use whatever other tools you think are best to accomplish the requirements below (for example, local component state using `setState()`, Redux, MobX, etc).

We're primarily interested in seeing how you structure and implement a small JavaScript project so there is no requirement to spend a lot of time on styling (though it should be presentable). However, if CSS is your strength, feel free to make it beautiful!

We estimate this exercise will take somewhere between 2-3 hours to complete. Please attempt to write modular, reusable code, where possible.

# Instructions

1.  Fork this repository.
2.  Install dependencies with `npm install` or `yarn`.
3.  Run `npm start` or `yarn start`. This should start a webpack dev server, and the app should be accessible at `http://localhost:8080/`
4.  When you're done, please open a pull request and send us an email letting us know you're done.

If you have any problems getting the app started or installing the dependencies, please let us know.

# Location Data

`src/helpers/api.js` contains the function `fetchLocations` which will fetch 25 random locations from BentoBox. It is currently called in `<App />`, but feel free to move it to whichever component you think makes the most sense.

# Requirements

1.  When `fetchLocations()` is called, display an indication to the user that the locations are loading (this could be a loader or a simple message).

2.  Based on the response from `fetchLocations()`, place corresponding pins on a map (use whatever mapping library you choose).

3.  Add tooltips that open when clicking a pin. The tooltip should contain the name and address of the location, as well as a button to "view details.""

4.  When a user clicks on "view details", this should display all the location data (e.g., name, address, an image, and hours if present in response, etc.) somewhere else on the page. For example, you could have the map on one side of the screen and the selected location details on the other, or you could display the details in a modal.

# Optional

1.  If more than one image is returned by the API for a given location, display an image slider.
2.  Implement undo/redo functionality to cycle through the previously selected locations.
