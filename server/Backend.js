(function (root, factory) {
  root.BACKEND = factory();
})(this, function () {

  const { REFERENCES_MANAGER, modulesRequire } = CCLIBRARIES

  const MASTER_INDEX_FILE_ID = "1ohC9kPnMxyptp8SadRBGAofibGiYTTev" // OPEN ACCESS
  const REQUIRED_REFERENCES = ["deployedScripts"]; // OPEN ACCESS

  let referencesObj
  let user

  function getFeed() {
    const { eventsFeed, divisionProperties } = getFeedViaAPI()
    user = Session.getActiveUser().getEmail()
    augmentParameters(eventsFeed)
    return JSON.stringify({ eventsFeed, divisionProperties, user })
  }

  function getFeedViaAPI() {
    referencesObj = referencesObj || REFERENCES_MANAGER.init(MASTER_INDEX_FILE_ID).requireFiles(REQUIRED_REFERENCES).requiredFiles;
    const ccEventsScriptsInfoObj = referencesObj.deployedScripts.fileContent.CCEVENTSMANAGEMENTBACKEND;
    const CCEVENTSMANAGEMENTBACKEND = modulesRequire(ccEventsScriptsInfoObj);
    const response = CCEVENTSMANAGEMENTBACKEND.get({
      process: "getEventsAppPackage"
    });
    return response
  }

  function augmentParameters(eventsFeed) {
    eventsFeed.forEach(formulateSingleEntries)
  }

  function formulateSingleEntries(eventObj) {
    const { scheduledDate } = eventObj
    let schedDate
    if (Array.isArray(scheduledDate)) schedDate = scheduledDate[0]
    else schedDate = scheduledDate
    const { category, status } = categorizeEvent(schedDate)
    eventObj.schedDate = schedDate
    eventObj.category = category
    eventObj.status = status // TEMP
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
    // request = {
    //   request: "newEvent",
    //   division: "Events",
    //   activity: "CCG",
    //   season: "S11",
    //   roundName: "",
    //   roundCode: "SXIR3",
    //   sourceType: "GSheet",
    //   user: "mennahtarekelkassar@gmail.com",
    //   // application_description: "welcome, < user >!",
    //   setDate: "2021-08-20T22:00:00.000Z",
    //   // facebookGroupLink: "https://www.facebook.com/groups/ccgatheringsixr5",
    //   // whatsappGroupLink: "https://chat.whatsapp.com/JADk5wqutxe4dOjNygchZh",
    //   talkingTopic: "You"
    // }
    user = Session.getActiveUser().getEmail()
    request = { ...request, division: "Events" }
    const response = createEventSourcesViaAPI({ ...request, request: "newEvent", sourceType: "GSheet", user })
    const { data } = response
    delete data.sourcesUpdateSuccess
    return JSON.stringify({ ...request, ...data })
  }

  function createEventSourcesViaAPI(apiRequest) {
    referencesObj = referencesObj || REFERENCES_MANAGER.init(MASTER_INDEX_FILE_ID).requireFiles(REQUIRED_REFERENCES).requiredFiles;
    const ccEventsScriptsInfoObj = referencesObj.deployedScripts.fileContent.CCEVENTSMANAGEMENTBACKEND;
    const CCEVENTSMANAGEMENTBACKEND = modulesRequire(ccEventsScriptsInfoObj);
    console.log(apiRequest)
    const response = CCEVENTSMANAGEMENTBACKEND.post({
      process: "createNextGatheringsRound",
      ...apiRequest
    });
    console.log(response)
    return response
  }

  function addEventToDB(request) {
    // request = {
    //   division: "Events",
    //   activity: "CCG",
    //   facebookGroupLink: "",
    //   round: "R4",
    //   roundCode: "SXIR4",
    //   roundName: "Movie Night",
    //   season: "S11",
    //   seasonCode: "SXI",
    //   setDate: "2024-05-03T20:33",
    //   talkingTopic: "",
    //   whatsappGroupLink: "",
    //   allForms: ""
    // }
    const { forms } = request
    const allForms = getAllForms(forms)
    console.log(allForms)
    const eventRequestObj = new EventObj({ ...request, allForms })
    console.log(eventRequestObj)
    const eventObj = addEventToDBViaAPI(eventRequestObj)
    formulateSingleEntries(eventObj)
    return JSON.stringify(eventObj)
  }

  function getAllForms(forms) {
    const allForms = []
    Object.entries(forms).forEach(([formType, formGroupObj]) => {
      const formsObj = new FormsObj(formType, formGroupObj.editURL, formGroupObj.viewURL, formGroupObj.responseSheetURL)
      allForms.push(formsObj)
    })
    return allForms
  }

  function EventObj({
    division,
    activity,
    roundName,
    title = "",
    setDate = "",
    description,
    extendedDescription = "",
    location = "",
    locationLink = "",
    locationExtention = 1,
    whatsappGroupLink = "",
    facebookGrroupLink = "",
    roundCode,
    season = "",
    allForms,
  }) {
    this.key = activity + "-" + roundCode
    this.name = roundName
    this.title = title
    this.creationDate = new Date()
    this.scheduledDate = [setDate]
    this.description = description
    this.extendedDescription = extendedDescription
    this.roundCode = roundCode
    this.division = activity
    this.season = season
    this.branch = division
    this.locationExtention = locationExtention
    this.socialMedia = {
      whatsappGroupLink: whatsappGroupLink,
      facebookGroupLink: facebookGrroupLink
    },
      this.eventInfo = {
        address: location,
        locationLink: locationLink
      }
    this.eventLocations = [

    ]
    this.forms = allForms
  }

  function FormsObj(type, editLink, viewLink, resultsSheetLink) {
    this.type = type
    this.editLink = editLink
    this.viewLink = viewLink
    this.resultsSheetLink = resultsSheetLink
  }

  function addEventToDBViaAPI(request) {
    referencesObj = referencesObj || REFERENCES_MANAGER.init(MASTER_INDEX_FILE_ID).requireFiles(REQUIRED_REFERENCES).requiredFiles;
    const ccEventsScriptsInfoObj = referencesObj.deployedScripts.fileContent.CCEVENTSMANAGEMENTBACKEND;
    const CCEVENTSMANAGEMENTBACKEND = modulesRequire(ccEventsScriptsInfoObj);
    const response = CCEVENTSMANAGEMENTBACKEND.post({
      process: "addNewEvent",
      ...request
    });
    console.log(response)
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
