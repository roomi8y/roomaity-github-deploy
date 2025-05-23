# UI Mockups for Map Integration - Roomaity Platform

This document outlines text-based UI mockups for integrating map functionality into the Roomaity platform.

**Map Provider Assumption:** Google Maps or a similar interactive map provider.

## 1. Search Results Page (`search.html` - Enhanced)

### 1.1. Map View Toggle

*   **Description:**
    *   A prominent toggle switch or a set of two buttons (e.g., "List View" | "Map View") will be placed near the top of the search results area, possibly next to the sort options or filter toggles.
    *   The currently active view (List or Map) will be visually highlighted.
    *   Switching to "Map View" would change the primary display area to show the map. Switching to "List View" would show the traditional card-based listing results.
*   **Interaction:**
    *   Clicking the "Map View" toggle/button hides the list view (or shrinks it in a split view) and displays the map.
    *   Clicking the "List View" toggle/button hides the map (or shrinks it) and displays the list.
    *   The state of the toggle should persist during the user's session or be part of the URL query parameters for shareable links.
*   **ASCII Representation (Toggle Button):**

    ```
    +-------------------------------------------------+
    | Filters | Sort By: [Newest]  [List View] [Map View] |
    +-------------------------------------------------+
    |                                                 |
    |          [Search Results Area]                  |
    |                                                 |
    ```

### 1.2. Map Display

*   **Layout Options:**
    *   **Option A: Full Page Map View:**
        *   When "Map View" is active, the map takes up the majority of the content area previously occupied by the list results. Filters might remain in a sidebar or become a modal.
        *   A small, clickable "Show List" button or icon might be overlaid on the map to switch back or to a split view.
    *   **Option B: Split View (Default or an additional option):**
        *   The page is divided into two vertical panes. One pane displays the interactive map, and the other displays a scrollable list of search results.
        *   The list items might be more compact in this view.
        *   Selecting a listing in the list highlights its marker on the map, and vice-versa.
        *   **ASCII (Split View):**
            ```
            +----------------------+------------------------+
            | Filters Sidebar      | Sort By / View Toggle  |
            +----------------------+------------------------+
            |                      |                        |
            | [Scrollable Map Area]| [Scrollable List Area] |
            |                      |                        |
            |                      |                        |
            +----------------------+------------------------+
            ```

*   **Listing Representation (Markers):**
    *   Each listing from the current search results is represented by a marker (pin icon) on the map at its latitude/longitude.
    *   Markers could be color-coded or use different icons based on listing type (e.g., private room, shared room) or price range (e.g., green for low, orange for mid, red for high).
    *   Consider clustering markers at high zoom levels to avoid visual clutter. Clicking a cluster would zoom in to show individual markers.

*   **Marker Interaction (Hover/Click):**
    *   **Hover:** On hovering over a map marker, a small, non-intrusive tooltip or "info window" appears briefly.
        *   Content: Listing title, price (e.g., "1200 SAR/month").
    *   **Click:** On clicking a map marker:
        *   A more detailed info window opens. This window is "sticky" until closed or another marker is clicked.
        *   Content: Small thumbnail image of the property, title, price, number of bedrooms/bathrooms (key icons), and a "View Details" button/link.
        *   If in split view, clicking a marker could also scroll the list view to the corresponding listing and highlight it.
    *   **SVG Representation (Info Window - conceptual):**
        ```svg
        <svg width="200" height="120" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="#fff" stroke="#ccc" rx="5" ry="5"/>
          <image href="images/room_thumb.jpg" x="10" y="10" height="60" width="60"/>
          <text x="80" y="25" font-family="Arial" font-size="12" fill="#333">Cozy Room in Olaya</text>
          <text x="80" y="45" font-family="Arial" font-size="14" fill="#E91E63" font-weight="bold">1500 SAR/mo</text>
          <text x="80" y="60" font-family="Arial" font-size="10" fill="#555">Private Room - 1 Bath</text>
          <rect x="10" y="80" width="180" height="30" fill="#007bff" rx="3" ry="3"/>
          <text x="60" y="100" font-family="Arial" font-size="12" fill="#fff">View Details</text>
        </svg>
        ```

*   **Interaction with Filters:**
    *   The map updates dynamically as filters (price, room type, amenities, etc.) are applied or changed in the filter sidebar.
    *   Only listings matching the current filter criteria are displayed as markers on the map.
    *   The map's viewport might readjust (zoom/pan) to best fit the filtered results, or it could maintain its current viewport if "search as I move the map" is active.

*   **"Search As I Move The Map" Feature:**
    *   A checkbox or toggle button, typically overlaid on the map (e.g., "Search this area").
    *   **When unchecked (default):** The map displays results based on the initial search query and filters, regardless of map panning/zooming. A "Redo search in this area" button might appear if the user moves the map significantly.
    *   **When checked:** If the user pans or zooms the map to a new area, the search query automatically updates to reflect the current map viewport boundaries. New listings within this area are fetched and displayed as markers (respecting existing filters). This provides a more exploratory search experience.

## 2. Listing Details Page (Conceptual `room-details.html`)

### 2.1. Map Display

*   **Description:**
    *   A dedicated section on the listing details page (e.g., "Location" or "Neighborhood") will feature an embedded map.
    *   A single, prominent marker shows the specific location of the property.
    *   The map should be interactive (zoomable, pannable).
    *   To protect privacy, the exact location marker might be slightly obfuscated (e.g., showing a general area or a circle, with exact address revealed only after booking or user consent, as per platform policy). This should be clearly communicated.
*   **Layout:**
    *   Typically a medium-sized map embed, perhaps half the width of the content area or full-width within its section.
    *   **ASCII Representation:**
        ```
        +-------------------------------------------------+
        | Listing Title / Images / Description            |
        +-------------------------------------------------+
        | Amenities / Details                             |
        +-------------------------------------------------+
        | Location Section                                |
        | +---------------------------------------------+ |
        | |                                             | |
        | |           [   Interactive Map   ]           | |
        | |           [ with Property Marker]           | |
        | |                                             | |
        | +---------------------------------------------+ |
        | Address: 123 Main St, Al Olaya, Riyadh (approx) |
        +-------------------------------------------------+
        ```

### 2.2. Points of Interest (POIs)

*   **Description:**
    *   Below or overlaid on the map, provide controls (e.g., checkboxes or icon buttons) to toggle the display of nearby POIs.
    *   Categories for POIs:
        *   `[ ] Supermarkets`
        *   `[ ] Public Transport (Bus Stops, Metro Stations)`
        *   `[ ] Restaurants & Cafes`
        *   `[ ] Parks & Recreation`
        *   `[ ] Universities/Colleges`
        *   `[ ] Mosques`
    *   When a category is toggled on, corresponding icons for these POIs appear on the map within a certain radius of the property.
*   **Interaction:**
    *   Clicking a POI icon on the map could show a small info window with its name and perhaps type (e.g., "Tamimi Markets - Supermarket").
    *   The map should allow users to pan and zoom to explore the neighborhood and the POIs.

## 3. List Your Room Page (e.g., `list-room.html`)

### 3.1. Location Input

*   **Description:**
    *   A dedicated section for location input, crucial for accurate listing.
*   **UI Elements & Behavior:**
    1.  **Address Input Field:**
        *   A text input field for "Street Address, City, Neighborhood".
        *   As the user types, autocomplete suggestions (powered by a geocoding service like Google Places API) appear.
        *   Selecting an address from suggestions automatically populates latitude/longitude fields and places a pin on an accompanying map.
    2.  **Interactive Map for Pin Placement:**
        *   A map is displayed below the address input.
        *   If an address is entered, a pin appears on the map at the geocoded location.
        *   The user can **drag this pin** to refine the location if the geocoding result is not perfectly accurate.
        *   Alternatively, if the user doesn't know the exact address or prefers visual selection, they can directly click on the map to place a pin, or drag an initial default pin.
    3.  **Latitude/Longitude Fields:**
        *   Two read-only (or optionally editable for advanced users) input fields displaying the current latitude and longitude derived from the pin's position on the map. These update automatically when the pin is moved or an address is geocoded.
    4.  **"Confirm Location" Button:**
        *   After the user is satisfied with the pin's position, they click this button.
    5.  **Privacy Note:** A small disclaimer about location privacy options (e.g., "Your exact address will only be shared with confirmed roommates. The map will show an approximate area to the public.").

*   **ASCII Representation:**
    ```
    +-------------------------------------------------+
    | Section: Property Location                      |
    +-------------------------------------------------+
    | Address: [___________________________________]  |
    |          (Autocomplete suggestions appear here)   |
    |                                                 |
    | +---------------------------------------------+ |
    | |                                             | |
    | |           [   Interactive Map   ]           | |
    | |           [ Draggable Pin Here  ]           | |
    | |                                             | |
    | +---------------------------------------------+ |
    |                                                 |
    | Latitude:  [ Read-only Lat Text ]             |
    | Longitude: [ Read-only Lon Text ]             |
    |                                                 |
    | [ ] Show approximate location on public map     |
    |                                                 |
    |           [ Confirm Location Button ]           |
    +-------------------------------------------------+
    ```

This document provides a foundational description for the map integration UI/UX on the Roomaity platform. Further details would be refined during the design and development process.
```
