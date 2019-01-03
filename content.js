main();

function main() {
  return new Promise((resolve, reject) => {
    const playersUl = document.getElementsByClassName("users-fireteam")[0];
    const activityHeader = document.getElementsByClassName(
      "activity-header"
    )[0];
    const platform = document.getElementsByClassName("platform")[0].innerHTML;

    let membershipType = 0;
    if (platform.toLowerCase() === "psn") {
      membershipType = 2;
    } else if (platform.toLowerCase() === "xbox") {
      membershipType = 1;
    } else {
      membershipType = 4;
    }

    var items = playersUl.getElementsByTagName("li");

    for (let i = 0; i < items.length; ++i) {
      startGettingPlayersData(items[i], membershipType, activityHeader);
    }
    resolve();
  });
}
