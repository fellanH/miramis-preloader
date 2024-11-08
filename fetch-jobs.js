let currentPath = window.location.pathname;

function openJobDrawer(id, drawerSlug) {
  if (!id || !drawerSlug) {
    console.error("Invalid parameters for openJobDrawer:", id, drawerSlug);
    return;
  }
  console.log("openJobDrawer", id);
  let jobDrawer = document.getElementById(id);
  if (jobDrawer) {
    jobDrawer.classList.add("active");
    history.pushState({ drawerId: id }, "", `${currentPath}#${drawerSlug}`);
  } else {
    console.warn("Job drawer not found for id:", id);
  }
}

function closeJobDrawer(id) {
  console.log("closeJobDrawer", id);
  let jobDrawer = document.getElementById(id);
  jobDrawer.classList.remove("active");
  history.pushState({}, "", currentPath);
}

window.addEventListener("popstate", (event) => {
  if (event.state && event.state.drawerId) {
    const drawerSlug = document.getElementById(event.state.drawerId)?.dataset
      .slug;
    if (drawerSlug) {
      openJobDrawer(event.state.drawerId, drawerSlug);
    } else {
      console.warn("Drawer slug not found for drawerId:", event.state.drawerId);
    }
  } else {
    document.querySelectorAll(".job_drawer.active").forEach((drawer) => {
      drawer.classList.remove("active");
    });
  }
});

function checkAndOpenDrawerFromURL() {
  const pathParts = window.location.href.split("#");
  const drawerSlug = pathParts[pathParts.length - 1];
  const jobDrawer = document.querySelector(
    `.job_drawer[data-slug="${drawerSlug}"]`
  );

  if (jobDrawer) {
    const drawerId = jobDrawer.id;
    openJobDrawer(drawerId, drawerSlug);
    document.getElementById("jobs-section").scrollIntoView();
  }
}

fetch(
  "https://zinrec.intervieweb.it/annunci.php?lang=it&LAC=erqole&d=miramis.webflow.io&k=310fe17fefa967c138953fe92292759b&CodP=&format=json_en&utype=0"
)
  .then((response) => response.json())
  .then((data) => {
    const jobListings = document.getElementById("job-container");
    const exampleJob = document.getElementById("example-job");
    exampleJob.remove();

    data.forEach((job) => {
      let drawerID = "job-drawer-" + job.id;
      let slug = job.slug;
      // Format job description
      let tempDiv = document.createElement("div");
      tempDiv.innerHTML = job.description;
      let firstPTag = tempDiv.querySelector("p");
      let jobDescription = firstPTag ? firstPTag.textContent : "";

      // Format job published date
      let tempDiv2 = document.createElement("div");
      tempDiv2.innerHTML = job.published;
      let dateParts = tempDiv2.textContent.split(" ")[0].split("-");
      let dateObject = new Date(
        `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
      );
      let options = { year: "numeric", month: "long", day: "numeric" };
      let formattedDate = dateObject.toLocaleDateString("en-US", options);

      // Create job element
      const jobElement = document.createElement("div");
      jobElement.innerHTML = `
    <!--html-->
        <div id="job-item" class="job_item">
        <div class="job-listing" onclick="openJobDrawer('${drawerID}', '${slug}')">
            <div class="title">
                <div id="job-title" class="heading-style-h3">${job.title}</div>
            </div>
            <div class="details">
                <div id="job-location" class="text-style-label">${job.location}</div>
                <div id="job-date" class="text-style-label text-color-grey">${formattedDate}</div>
            </div>
            <div class="description">
                <p id="job-description" class="text-color-dark-grey text-style-3lines">${jobDescription}</p>
            </div>
            <div id="btn-open-drawer" class="button_primary">
                <div class="text-style-label">Read more</div>
            </div>
        </div>
        <div id="${drawerID}" class="job_drawer" data-slug="${slug}">
            <div class="job_wrapper">
                <div class="drawer_menu"><a href="#" class="button_primary w-inline-block" onclick="closeJobDrawer('${drawerID}')">
                        <div class="text-style-label">Close</div>
                    </a></div>
                <div class="padding-global padding-section-large">
                    <div class="job_layout">
                        <div class="job-preview_tags">
                            <p class="text-style-label">${job.company}</p>
                            <p class="text-style-label">${job.location}</p>
                            <p class="text-style-label">${job.function}</p>
                        </div>
                        <h1>${job.title}</h1>
                        <div class="job-preview_button-wrapper"><a href="${job.url}"
                                class="button_primary w-inline-block">
                                <div class="text-style-label">Apply now</div>
                            </a></div>
                        <div class="image_wrapper"><img
                                src="${job.coverImage}"
                                alt="" loading="eager"
                                class="image"></div>
                        ${job.description}
                        ${job.company_description}
                        ${job.position_description}
                        ${job.requirements_description}
                        ${job.other_information_description}
                        <div id="job-iframe" class="job-application-iframe w-embed w-iframe"><iframe
                                src="${job.registration_iframe_url}"
                                width="100%" height="600" frameborder="0" allowfullscreen=""></iframe></div>
                    </div>
                </div>
            </div>
            <div class="job_close-area" onclick="closeJobDrawer('${drawerID}')"></div>
        </div>
    </div>
    <!--!html-->
        `;
      jobListings.appendChild(jobElement);
    });

    // Call the function to check the URL and open the drawer if needed
    checkAndOpenDrawerFromURL();
  })
  .catch((error) => {
    console.error("Error:", error);
  });
