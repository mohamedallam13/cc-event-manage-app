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
    const CCEVENTSMANAGEMENTBACKEND = modulesRequire(ccEventsScriptsInfoObj);
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
      eventObj.schedDate = schedDate
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
      return { category: "current", status: "In Progress" };
    } else if (eventDateTime > currentDateTime) {
      return { category: "future", status: "Scheduled" };
    } else {
      return { category: "past", status: "Concluded" };
    }
  }

  function createEventInfraStructure(request) {
    request = {
      request: "newEvent",
      division: "Events",
      activity: "CCG",
      season: "S11",
      roundName: "",
      roundCode: "SXIR3",
      sourceType: "GSheet",
      user: "mennahtarekelkassar@gmail.com",
      // application_description: "welcome, < user >!",
      setDate: "2021-08-20T22:00:00.000Z",
      // facebookGroupLink: "https://www.facebook.com/groups/ccgatheringsixr5",
      // whatsappGroupLink: "https://chat.whatsapp.com/JADk5wqutxe4dOjNygchZh",
      talkingTopic: "You"
    }
    const response = createEventSourcesViaAPI(request)
    return response
  }

  function createEventSourcesViaAPI(request) {
    referencesObj = referencesObj || REFERENCES_MANAGER.init(MASTER_INDEX_FILE_ID).requireFiles(REQUIRED_REFERENCES).requiredFiles;
    const ccEventsScriptsInfoObj = referencesObj.deployedScripts.fileContent.CCEVENTSMANAGEMENTBACKEND;
    const CCEVENTSMANAGEMENTBACKEND = modulesRequire(ccEventsScriptsInfoObj);
    const response = CCEVENTSMANAGEMENTBACKEND.post({
      process: "createNextGatheringsRound",
      ...request
    });
    return response
  }

  function addEventToDB() {
    const response = addEventToDBViaAPI(request)
    // Regenerate Feed
  }

  function addEventToDBViaAPI(request) {
    referencesObj = referencesObj || REFERENCES_MANAGER.init(MASTER_INDEX_FILE_ID).requireFiles(REQUIRED_REFERENCES).requiredFiles;
    const ccEventsScriptsInfoObj = referencesObj.deployedScripts.fileContent.CCEVENTSMANAGEMENTBACKEND;
    const CCEVENTSMANAGEMENTBACKEND = modulesRequire(ccEventsScriptsInfoObj);
    const response = CCEVENTSMANAGEMENTBACKEND.post({
      process: "addNewEvent",
      ...request
    });
    return response
  }

  return {
    getFeed,
    createEventInfraStructure,
    addEventToDB
  }

})

function loadFeed() {
  return BACKEND.getFeed()
}

function createEventInfraStructure(request) {
  return BACKEND.createEventInfraStructure(request)
}

function addEventToDB(request) {
  return BACKEND.addEventToDB(request)
}
