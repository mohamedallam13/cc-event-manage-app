(function (root, factory) {
  root.BACKEND = factory();
})(this, function () {

  const { REFERENCES_MANAGER, modulesRequire } = CCLIBRARIES

  const MASTER_INDEX_FILE_ID = "1ohC9kPnMxyptp8SadRBGAofibGiYTTev" // OPEN ACCESS
  const REQUIRED_REFERENCES = ["deployedScripts"]; // OPEN ACCESS

  let referencesObj



  function getFeed() {
    const eventsFeed = getFeedViaAPI()
    augmentParameters(eventsFeed)
    return JSON.stringify({ eventsFeed })
  }

  function getFeedViaAPI() {
    referencesObj = referencesObj || REFERENCES_MANAGER.init(MASTER_INDEX_FILE_ID).requireFiles(REQUIRED_REFERENCES).requiredFiles;
    const ccEventsScriptsInfoObj = referencesObj.deployedScripts.fileContent.CCEVENTSMANAGEMENTBACKEND;
    CCEVENTSMANAGEMENTBACKEND = modulesRequire(ccEventsScriptsInfoObj);
    const response = CCEVENTSMANAGEMENTBACKEND.get({
      process: "getEventsFeed"
    });
    return response.eventsFeed
  }

  function augmentParameters(eventsFeed) {
    eventsFeed.forEach(eventObj => {
      const { sceduledDate } = eventObj
      let schedDate
      if (Array.isArray(sceduledDate)) schedDate = sceduledDate[0]
      else schedDate = sceduledDate
      const { category, status } = categorizeEvent(schedDate)
      eventObj.category = category
      eventObj.status = status // TEMP
    })
  }

  function categorizeEvent(dateTime) {
    const currentDateTime = new Date();
    const eventDateTime = new Date(dateTime);

    // Set time window boundaries (6:00 PM and 11:00 PM)
    const startTimeWindow = new Date(eventDateTime);
    startTimeWindow.setHours(18, 0, 0, 0); // 6:00 PM
    const endTimeWindow = new Date(eventDateTime);
    endTimeWindow.setHours(23, 0, 0, 0); // 11:00 PM

    // Compare dates and times
    if (currentDateTime >= startTimeWindow && currentDateTime <= endTimeWindow) {
      return { category: "Current", status: "In Progress" };
    } else if (eventDateTime > currentDateTime) {
      return { category: "Future", status: "Scheduled" };
    } else {
      return { category: "Past", status: "Concluded" };
    }
  }

  function createEventInfraStructure(request) {
    // Create event docs and infrastructure elements
    // Get Response
    // If success
  }

  function addEventToDB() {
    // Add Event to DB
    // Regenerate Feed
  }

  return {
    getFeed
  }

})

function getFeed() {
  BACKEND.getFeed()
}

function createEventInfraStructure(request) {
  return BACKEND.createEventInfraStructure(request)
}

function addEventToDB(request) {
  return BACKEND.addEventToDB(request)
}
