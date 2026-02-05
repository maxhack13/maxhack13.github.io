function updateLocationOptions() {
    let modalitySelect = document.getElementById("event_modality");

    switch (modalitySelect.value) {
        case "in-person":
            //show location, hide remote url
            document.getElementById("event_location").parentElement.style.display = "block";
            document.getElementById("event_remote_url").parentElement.style.display = "none";
            break;
        case "remote":
            //show remote url, hide location
            document.getElementById("event_location").parentElement.style.display = "none";
            document.getElementById("event_remote_url").parentElement.style.display = "block";
            break;
    }
}

const events = [];
let editingEvent = null; // null = creating new, otherwise = editing existing

function showEventDetails(eventDetails) {
    // Populate form with event data
    document.getElementById("event_name").value = eventDetails.name;
    document.getElementById("event_category").value = eventDetails.category;
    document.getElementById("event_weekday").value = eventDetails.weekday;
    document.getElementById("event_time").value = eventDetails.time;
    document.getElementById("event_modality").value = eventDetails.location ? "in-person" : "remote";
    document.getElementById("event_location").value = eventDetails.location || "";
    document.getElementById("event_remote_url").value = eventDetails.remoteUrl || "";
    document.getElementById("event_attendees").value = eventDetails.attendees;

    updateLocationOptions(); // Show/hide location or remote URL field
    editingEvent = eventDetails; // Mark that we're editing THIS event

    // Open the modal
    const myModalElement = document.getElementById('event_modal');
    const myModal = bootstrap.Modal.getOrCreateInstance(myModalElement);
    myModal.show();
}

function saveEvent() {
    let eventName = document.getElementById("event_name").value;
    let eventCategory = document.getElementById("event_category").value;
    let eventWeekday = document.getElementById("event_weekday").value;
    let eventTime = document.getElementById("event_time").value;
    let eventLocation = document.getElementById("event_location").value;
    let eventRemoteUrl = document.getElementById("event_remote_url").value;
    let eventAttendees = document.getElementById("event_attendees").value;

    if (editingEvent) {
        // Update existing event
        editingEvent.name = eventName;
        editingEvent.category = eventCategory;
        editingEvent.weekday = eventWeekday;
        editingEvent.time = eventTime;
        editingEvent.location = eventLocation;
        editingEvent.remoteUrl = eventRemoteUrl;
        editingEvent.attendees = eventAttendees;

        // Remove old card and re-add updated one
        if (editingEvent.element) {
            editingEvent.element.remove();
        }
        addEventToCalendar(editingEvent);
        editingEvent = null;
    } else {
        // Create new event
        let newEvent = {
            name: eventName,
            category: eventCategory,
            weekday: eventWeekday,
            time: eventTime,
            location: eventLocation,
            remoteUrl: eventRemoteUrl,
            attendees: eventAttendees
        };
        events.push(newEvent);
        addEventToCalendar(newEvent);
    }

    document.getElementById("event_form").reset();
    const myModalElement = document.getElementById('event_modal');
    const myModal = bootstrap.Modal.getOrCreateInstance(myModalElement);
    myModal.hide();
}
function closeModal() {
    document.getElementById("event_form").reset();
}
function addEventToCalendar(eventInfo) {
    let event_element = createEventCard(eventInfo);
    document.getElementById(eventInfo.weekday).appendChild(event_element);
}

function createEventCard(eventDetails) {
    let event_element = document.createElement("div");
    event_element.classList = 'event row border rounded m-1 py-1';
    let info = document.createElement("div");

    event_element.style.cursor = "pointer";
    eventDetails.element = event_element; // Store reference to the element
    event_element.onclick = function () {
        showEventDetails(eventDetails);
    }


    info.innerHTML = `
        <strong>${eventDetails.name}</strong><br>
        Time: ${eventDetails.time}<br>
        ${eventDetails.location ? 'Location: ' + eventDetails.location : 'URL: ' + eventDetails.remoteUrl}<br>
        Attendees: ${eventDetails.attendees}
    `;
    event_element.appendChild(info);
    //add color based on category
    switch (eventDetails.category) {
        case "work":
            event_element.style.backgroundColor = "#efc520ff";
            break;
        case "personal":
            event_element.style.backgroundColor = "#5cb85c";
            break;
        case "academic":
            event_element.style.backgroundColor = "#5bc0de";
            break;
        case "other":
            event_element.style.backgroundColor = "#d9534f";
            break;
    }

    return event_element;
}