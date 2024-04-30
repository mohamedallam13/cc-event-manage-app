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
    const { sceduledDate } = eventObj
    let schedDate
    if (Array.isArray(sceduledDate)) schedDate = sceduledDate[0]
    else schedDate = sceduledDate
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
    return response
  }

  function addEventToDB(request) {
    const { forms } = request
    const allForms = getAllForms(forms)
    const eventRequestObj = new EventObj(...request, allForms)
    const newEventObj = addEventToDBViaAPI(eventRequestObj)
    formulateSingleEntries(newEventObj)
    return JSON.stringify(newEventObj)
  }

  function getAllForms(forms) {
    const allForms = {}
    Object.entries(forms).forEach(([formType, formGroupObj]) => {
      const formsObj = FormsObj(formType, formGroupObj.editURL, formGroupObj.viewLink, formGroupObj.responseSheetURL)
      allForms[formType] = formsObj
    })
    return allForms
  }

  function EventObj({
    division,
    name,
    title = "",
    creationDate = "",
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
    this.name = name
    this.title = title
    this.creationDate = creationDate
    this.sceduledDate = [setDate]
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
