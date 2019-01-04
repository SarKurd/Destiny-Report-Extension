function getCharacters(membershipType, membershipId) {
  return fetch(
    `https://www.bungie.net/Platform/Destiny2/${membershipType}/Profile/${membershipId}/?components=100`,
    {
      method: "GET",
      headers: {
        "X-API-KEY": "1aa9de6ff0d244049503b7d58f06ac94"
      }
    }
  ).then(data => data.json());
}
function getRaidStats(membershipType, membershipId, characterId) {
  return fetch(
    `https://www.bungie.net/Platform/Destiny2/${membershipType}/Account/${membershipId}/Character/${characterId}/Stats/AggregateActivityStats/`,
    {
      method: "GET",
      headers: {
        "X-API-KEY": "1aa9de6ff0d244049503b7d58f06ac94"
      }
    }
  ).then(data => data.json());
}

function simplifyRaidStats(stats) {
  const raid = {
    lastWish: { normalCompletions: 0, guided: 0 },
    SotP: { normalCompletions: 0, guided: 0 },
    EoW: { normalCompletions: 0, prestigeCompletions: 0, guided: 0 },
    SoS: { normalCompletions: 0, prestigeCompletions: 0, guided: 0 },
    leviathan: { normalCompletions: 0, prestigeCompletions: 0, guided: 0 }
  };

  for (let i = 0; i < stats.length; ++i) {
    if (stats[i][`character${i + 1}`] !== undefined) {
      stats[i][`character${i + 1}`].forEach(elm => {
        if (elm.activityHash === 2122313384) {
          raid.lastWish.normalCompletions +=
            elm.values.activityCompletions.basic.value;
        } else if (elm.activityHash === 1661734046) {
          raid.lastWish.guided += elm.values.activityCompletions.basic.value;
        } else if (elm.activityHash === 548750096) {
          raid.SotP.normalCompletions +=
            elm.values.activityCompletions.basic.value;
        } else if (elm.activityHash === 2812525063) {
          raid.SotP.guided += elm.values.activityCompletions.basic.value;
        } else if (elm.activityHash === 3089205900) {
          raid.EoW.normalCompletions +=
            elm.values.activityCompletions.basic.value;
        } else if (elm.activityHash === 2164432138) {
          raid.EoW.guided += elm.values.activityCompletions.basic.value;
        } else if (elm.activityHash === 809170886) {
          raid.EoW.prestigeCompletions +=
            elm.values.activityCompletions.basic.value;
        } else if (elm.activityHash === 119944200) {
          raid.SoS.normalCompletions +=
            elm.values.activityCompletions.basic.value;
        } else if (elm.activityHash === 3213556450) {
          raid.SoS.prestigeCompletions +=
            elm.values.activityCompletions.basic.value;
        } else if (elm.activityHash === 3004605630) {
          raid.SoS.guided += elm.values.activityCompletions.basic.value;
        } else if (
          elm.activityHash === 2693136600 ||
          elm.activityHash === 2693136601 ||
          elm.activityHash === 2693136602 ||
          elm.activityHash === 2693136603 ||
          elm.activityHash === 2693136604 ||
          elm.activityHash === 2693136605
        ) {
          raid.leviathan.normalCompletions +=
            elm.values.activityCompletions.basic.value;
        } else if (
          elm.activityHash === 417231112 ||
          elm.activityHash === 757116822 ||
          elm.activityHash === 1685065161 ||
          elm.activityHash === 2449714930 ||
          elm.activityHash === 3446541099 ||
          elm.activityHash === 3879860661
        ) {
          raid.leviathan.prestigeCompletions +=
            elm.values.activityCompletions.basic.value;
        } else if (
          elm.activityHash === 287649202 ||
          elm.activityHash === 3916343513 ||
          elm.activityHash === 4039317196 ||
          elm.activityHash === 89727599 ||
          elm.activityHash === 1875726950 ||
          elm.activityHash === 1699948563
        ) {
          raid.leviathan.guided += elm.values.activityCompletions.basic.value;
        }
      });
    }
  }
  return raid;
}

function createAndAppend(parent, item, value, className) {
  const li = document.createElement("li");
  li.setAttribute("class", `raid-stat ${className}`);
  li.appendChild(document.createTextNode(item + ": " + value));

  parent.appendChild(li);
}

async function startGettingPlayersData(player, membershipType, activityHeader) {
  try {
    const membershipId = player.getAttribute("data-membershipid");
    if (membershipId) {
      if (
        activityHeader.getAttribute("data-activity").toLowerCase() === "raid"
      ) {
        const result = await getCharacters(membershipType, membershipId);
        const characterIds = result.Response.profile.data.characterIds;

        const charactersRaidStats = await Promise.all(
          characterIds.map(characterId => {
            return getRaidStats(membershipType, membershipId, characterId);
          })
        );
        const raidStats = [];
        for (let k = 0; k < charactersRaidStats.length; ++k) {
          raidStats.push({
            [`character${k + 1}`]: charactersRaidStats[k].Response.activities
          });
        }

        const simplifiedRaid = simplifyRaidStats(raidStats);

        const statsUl = document.createElement("ul");
        statsUl.setAttribute("class", "raid-stat-container");

        createAndAppend(
          statsUl,
          "SOTP(n)",
          simplifiedRaid.SotP.normalCompletions,
          "blue-badge"
        );
        createAndAppend(
          statsUl,
          "SOTP(g)",
          simplifiedRaid.SotP.guided,
          "blue-badge"
        );
        createAndAppend(
          statsUl,
          "LW(n)",
          simplifiedRaid.lastWish.normalCompletions
        );
        createAndAppend(statsUl, "LW(g)", simplifiedRaid.lastWish.guided);
        createAndAppend(
          statsUl,
          "SOS(n)",
          simplifiedRaid.SoS.normalCompletions,
          "purple-badge"
        );
        createAndAppend(
          statsUl,
          "SOS(g)",
          simplifiedRaid.SoS.guided,
          "purple-badge"
        );
        createAndAppend(
          statsUl,
          "SOS(p)",
          simplifiedRaid.EoW.prestigeCompletions,
          "purple-badge"
        );
        createAndAppend(
          statsUl,
          "EOW(n)",
          simplifiedRaid.EoW.normalCompletions,
          "red-badge"
        );
        createAndAppend(
          statsUl,
          "EOW(g)",
          simplifiedRaid.EoW.guided,
          "red-badge"
        );
        createAndAppend(
          statsUl,
          "EOW(p)",
          simplifiedRaid.EoW.prestigeCompletions,
          "red-badge"
        );
        createAndAppend(
          statsUl,
          "LN(n)",
          simplifiedRaid.leviathan.normalCompletions,
          "yellow-badge"
        );
        createAndAppend(
          statsUl,
          "LN(g)",
          simplifiedRaid.leviathan.guided,
          "yellow-badge"
        );
        createAndAppend(
          statsUl,
          "LN(p)",
          simplifiedRaid.leviathan.prestigeCompletions,
          "yellow-badge"
        );
        player.style.paddingRight = "5px";
        player.appendChild(statsUl);
      }
    }
  } catch (err) {
    console.log(err);
  }
}
