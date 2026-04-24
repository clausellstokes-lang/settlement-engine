"use strict";
// Azgaar (azgaar.fmg@yandex.com). Minsk, 2017-2023. MIT License
// https://github.com/Azgaar/Fantasy-Map-Generator

// set debug options
const PRODUCTION = location.hostname && location.hostname !== "localhost" && location.hostname !== "127.0.0.1";
const DEBUG = JSON.safeParse(localStorage.getItem("debug")) || {};
const INFO = true;
const TIME = true;
const WARN = true;
const ERROR = true;

// detect device
const MOBILE = window.innerWidth < 600 || navigator.userAgentData?.mobile;

// Service worker disabled for embedded SettlementForge Map
if (false && PRODUCTION && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(err => {
      console.error("ServiceWorker registration failed: ", err);
    });
  });

  window.addEventListener(
    "beforeinstallprompt",
    async event => {
      event.preventDefault();
      const Installation = await import("./modules/dynamic/installation.js?v=1.89.19");
      Installation.init(event);
    },
    {once: true}
  );
}

// append svg layers (in default order)
let svg = d3.select("#map");
let defs = svg.select("#deftemp");
let viewbox = svg.select("#viewbox");
let scaleBar = svg.select("#scaleBar");
let legend = svg.append("g").attr("id", "legend");
let ocean = viewbox.append("g").attr("id", "ocean");
let oceanLayers = ocean.append("g").attr("id", "oceanLayers");
let oceanPattern = ocean.append("g").attr("id", "oceanPattern");
let lakes = viewbox.append("g").attr("id", "lakes");
let landmass = viewbox.append("g").attr("id", "landmass");
let texture = viewbox.append("g").attr("id", "texture");
let terrs = viewbox.append("g").attr("id", "terrs");
let biomes = viewbox.append("g").attr("id", "biomes");
let cells = viewbox.append("g").attr("id", "cells");
let gridOverlay = viewbox.append("g").attr("id", "gridOverlay");
let coordinates = viewbox.append("g").attr("id", "coordinates");
let compass = viewbox.append("g").attr("id", "compass").style("display", "none");
let rivers = viewbox.append("g").attr("id", "rivers");
let terrain = viewbox.append("g").attr("id", "terrain");
let relig = viewbox.append("g").attr("id", "relig");
let cults = viewbox.append("g").attr("id", "cults");
let regions = viewbox.append("g").attr("id", "regions");
let statesBody = regions.append("g").attr("id", "statesBody");
let statesHalo = regions.append("g").attr("id", "statesHalo");
let provs = viewbox.append("g").attr("id", "provs");
let zones = viewbox.append("g").attr("id", "zones");
let borders = viewbox.append("g").attr("id", "borders");
let stateBorders = borders.append("g").attr("id", "stateBorders");
let provinceBorders = borders.append("g").attr("id", "provinceBorders");
let routes = viewbox.append("g").attr("id", "routes");
let roads = routes.append("g").attr("id", "roads");
let trails = routes.append("g").attr("id", "trails");
let searoutes = routes.append("g").attr("id", "searoutes");
let temperature = viewbox.append("g").attr("id", "temperature");
let coastline = viewbox.append("g").attr("id", "coastline");
let ice = viewbox.append("g").attr("id", "ice");
let prec = viewbox.append("g").attr("id", "prec").style("display", "none");
let population = viewbox.append("g").attr("id", "population");
let emblems = viewbox.append("g").attr("id", "emblems").style("display", "none");
let icons = viewbox.append("g").attr("id", "icons");
let labels = viewbox.append("g").attr("id", "labels");
let burgIcons = icons.append("g").attr("id", "burgIcons");
let anchors = icons.append("g").attr("id", "anchors");
let armies = viewbox.append("g").attr("id", "armies");
let markers = viewbox.append("g").attr("id", "markers");
let fogging = viewbox
  .append("g")
  .attr("id", "fogging-cont")
  .attr("mask", "url(#fog)")
  .append("g")
  .attr("id", "fogging")
  .style("display", "none");
let ruler = viewbox.append("g").attr("id", "ruler").style("display", "none");
var debug = viewbox.append("g").attr("id", "debug");

lakes.append("g").attr("id", "freshwater");
lakes.append("g").attr("id", "salt");
lakes.append("g").attr("id", "sinkhole");
lakes.append("g").attr("id", "frozen");
lakes.append("g").attr("id", "lava");
lakes.append("g").attr("id", "dry");

coastline.append("g").attr("id", "sea_island");
coastline.append("g").attr("id", "lake_island");

terrs.append("g").attr("id", "oceanHeights");
terrs.append("g").attr("id", "landHeights");

labels.append("g").attr("id", "states");
labels.append("g").attr("id", "addedLabels");
let burgLabels = labels.append("g").attr("id", "burgLabels");

// population groups
population.append("g").attr("id", "rural");
population.append("g").attr("id", "urban");

// emblem groups
emblems.append("g").attr("id", "burgEmblems");
emblems.append("g").attr("id", "provinceEmblems");
emblems.append("g").attr("id", "stateEmblems");

// compass
compass.append("use").attr("xlink:href", "#defs-compass-rose");

// fogging
fogging.append("rect").attr("x", 0).attr("y", 0).attr("width", "100%").attr("height", "100%");
fogging
  .append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("fill", "#e8f0f6")
  .attr("filter", "url(#splotch)");

// assign events separately as not a viewbox child
scaleBar.on("mousemove", () => tip("Click to open Units Editor")).on("click", () => editUnits());
legend
  .on("mousemove", () => tip("Drag to change the position. Click to hide the legend"))
  .on("click", () => clearLegend());

// main data variables
var grid = {}; // initial graph based on jittered square grid and data
var pack = {}; // packed graph and data
var seed;
let mapId;
let mapHistory = [];
let elSelected;
let modules = {};
let notes = [];
let rulers = new Rulers();
let customization = 0;

// global options; in v2.0 to be used for all UI settings
let options = {
  pinNotes: false,
  winds: [225, 45, 225, 315, 135, 315],
  temperatureEquator: 27,
  temperatureNorthPole: -30,
  temperatureSouthPole: -15,
  stateLabelsMode: "auto",
  showBurgPreview: true,
  burgs: {
    groups: JSON.safeParse(localStorage.getItem("burg-groups")) || Settlements.getDefaultGroups()
  }
};

// global style object; in v2.0 to be used for all map styles and render settings
let style = {burgLabels: {}, burgIcons: {}, anchors: {}};

let biomesData = Biomes.getDefault();
let nameBases = Names.getNameBases(); // cultures-related data
let color = d3.scaleSequential(d3.interpolateSpectral); // default color scheme
const lineGen = d3.line().curve(d3.curveBasis); // d3 line generator with default curve interpolation

// d3 zoom behavior
let scale = 1;
let viewX = 0;
let viewY = 0;

let rafId = null;
let pendingScaleChange = false;
let pendingPositionChange = false;
function zoomRaf() {
  const {k, x, y} = d3.event.transform;

  const isScaleChanged = Boolean(scale - k);
  const isPositionChanged = Boolean(viewX - x || viewY - y);
  if (!isScaleChanged && !isPositionChanged) return;

  scale = k;
  viewX = x;
  viewY = y;

  // Coalesce multiple zoom events into one paint.
  // While a RAF is pending, keep updating latest transform state and OR-change flags.
  // The scheduled RAF consumes these accumulated flags and then resets them.
  pendingScaleChange = pendingScaleChange || isScaleChanged;
  pendingPositionChange = pendingPositionChange || isPositionChanged;

  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    rafId = null;

    // Safely clears these flags for future renders
    const didScaleChange = pendingScaleChange;
    const didPositionChange = pendingPositionChange;
    pendingScaleChange = false;
    pendingPositionChange = false;

    // Uses global values, so each frame always draws using the latest positioning values
    viewbox.attr("transform", `translate(${viewX} ${viewY}) scale(${scale})`);

    if (didPositionChange) {
      if (layerIsOn("toggleCoordinates")) drawCoordinates();
    }

    if (customization === 1) {
      const canvas = byId("canvas");
      if (canvas && canvas.style.opacity !== "0") {
        const img = byId("imageToConvert");
        if (img) {
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.setTransform(scale, 0, 0, scale, viewX, viewY);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
      }
    }

    if (didScaleChange) {
      postZoom();
    }
  })
}

const postZoom = () => {
  invokeActiveZooming();
  drawScaleBar(scaleBar, scale);
  fitScaleBar(scaleBar, svgWidth, svgHeight);
}

const zoom = d3.zoom().scaleExtent([1, 20]).on("zoom", zoomRaf);

var mapCoordinates = {}; // map coordinates on globe
let populationRate = +byId("populationRateInput").value;
let distanceScale = +byId("distanceScaleInput").value;
let urbanization = +byId("urbanizationInput").value;
let urbanDensity = +byId("urbanDensityInput").value;

applyStoredOptions();

// voronoi graph extension, cannot be changed after generation
var graphWidth = +mapWidthInput.value;
var graphHeight = +mapHeightInput.value;

// svg canvas resolution, can be changed
let svgWidth = graphWidth;
let svgHeight = graphHeight;

landmass.append("rect").attr("x", 0).attr("y", 0).attr("width", graphWidth).attr("height", graphHeight);
oceanPattern
  .append("rect")
  .attr("fill", "url(#oceanic)")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", graphWidth)
  .attr("height", graphHeight);
oceanLayers
  .append("rect")
  .attr("id", "oceanBase")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", graphWidth)
  .attr("height", graphHeight);

document.addEventListener("DOMContentLoaded", async () => {
  if (!location.hostname) {
    const wiki = "https://github.com/Azgaar/Fantasy-Map-Generator/wiki/Run-FMG-locally";
    alertMessage.innerHTML = /* html */ `SettlementForge Map cannot run serverless. Follow the <a href="${wiki}" target="_blank">instructions</a> on how you can easily run a local web-server`;

    $("#alert").dialog({
      resizable: false,
      title: "Loading error",
      width: "28em",
      position: {my: "center center-4em", at: "center", of: "svg"},
      buttons: {
        OK: function () {
          $(this).dialog("close");
        }
      }
    });
  } else {
    hideLoading();
    await checkLoadParameters();
  }
  restoreDefaultEvents(); // apply default viewbox events
  initiateAutosave();
});

function hideLoading() {
  d3.select("#loading").transition().duration(3000).style("opacity", 0);
  d3.select("#optionsContainer").transition().duration(2000).style("opacity", 1);
  d3.select("#tooltip").transition().duration(3000).style("opacity", 1);
}

function showLoading() {
  d3.select("#loading").transition().duration(200).style("opacity", 1);
  d3.select("#optionsContainer").transition().duration(100).style("opacity", 0);
  d3.select("#tooltip").transition().duration(200).style("opacity", 0);
}

// decide which map should be loaded or generated on page load
async function checkLoadParameters() {
  const url = new URL(window.location.href);
  const params = url.searchParams;

  // of there is a valid maplink, try to load .map/.gz file from URL
  if (params.get("maplink")) {
    WARN && console.warn("Load map from URL");
    const maplink = params.get("maplink");
    const pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    const valid = pattern.test(maplink);
    if (valid) {
      setTimeout(() => {
        loadMapFromURL(maplink, 1);
      }, 1000);
      return;
    } else showUploadErrorMessage("Map link is not a valid URL", maplink);
  }

  // if there is a seed (user of MFCG provided), generate map for it
  if (params.get("seed")) {
    WARN && console.warn("Generate map for seed");
    await generateMapOnLoad();
    return;
  }

  // check if there is a map saved to indexedDB
  if (byId("onloadBehavior").value === "lastSaved") {
    try {
      const blob = await ldb.get("lastMap");
      if (blob) {
        WARN && console.warn("Loading last stored map");
        uploadMap(blob);
        return;
      }
    } catch (error) {
      ERROR && console.error(error);
    }
  }

  // else generate random map
  WARN && console.warn("Generate random map");
  generateMapOnLoad();
}

async function generateMapOnLoad() {
  await applyStyleOnLoad(); // apply previously selected default or custom style
  await generate(); // generate map
  applyLayersPreset(); // apply saved layers preset and reder layers
  drawLayers();
  fitMapToScreen();
  focusOn(); // based on searchParams focus on point, cell or burg from MFCG
  toggleAssistant();
}

// focus on coordinates, cell or burg provided in searchParams
function focusOn() {
  const url = new URL(window.location.href);
  const params = url.searchParams;

  const fromMGCG = params.get("from") === "MFCG" && document.referrer;
  if (fromMGCG) {
    if (params.get("seed").length === 13) {
      // show back burg from MFCG
      const burgSeed = params.get("seed").slice(-4);
      params.set("burg", burgSeed);
    } else {
      // select burg for MFCG
      findBurgForMFCG(params);
      return;
    }
  }

  const scaleParam = params.get("scale");
  const cellParam = params.get("cell");
  const burgParam = params.get("burg");

  if (scaleParam || cellParam || burgParam) {
    const scale = +scaleParam || 8;

    if (cellParam) {
      const cell = +params.get("cell");
      const [x, y] = pack.cells.p[cell];
      zoomTo(x, y, scale, 1600);
      return;
    }

    if (burgParam) {
      const burg = isNaN(+burgParam) ? pack.burgs.find(burg => burg.name === burgParam) : pack.burgs[+burgParam];
      if (!burg) return;

      const {x, y} = burg;
      zoomTo(x, y, scale, 1600);
      return;
    }

    const x = +params.get("x") || graphWidth / 2;
    const y = +params.get("y") || graphHeight / 2;
    zoomTo(x, y, scale, 1600);
  }
}

let isAssistantLoaded = false;
function toggleAssistant() {
  const assistantContainer = byId("chat-widget-container");
  const showAssistant = byId("azgaarAssistant").value === "show";

  if (showAssistant) {
    if (isAssistantLoaded) {
      assistantContainer.style.display = "block";
    } else {
      import("./libs/openwidget.min.js").then(() => {
        isAssistantLoaded = true;
        setTimeout(() => {
          const bubble = byId("chat-widget-minimized");
          if (bubble) {
            bubble.dataset.tip = "Click to open the Assistant";
            bubble.on("mouseover", showDataTip);
          }
        }, 5000);
      });
    }
  } else if (isAssistantLoaded) {
    assistantContainer.style.display = "none";
  }
}

// find burg for MFCG and focus on it
function findBurgForMFCG(params) {
  const cells = pack.cells,
    burgs = pack.burgs;
  if (pack.burgs.length < 2) {
    ERROR && console.error("Cannot select a burg for MFCG");
    return;
  }

  // used for selection
  const size = +params.get("size");
  const coast = +params.get("coast");
  const port = +params.get("port");
  const river = +params.get("river");

  let selection = defineSelection(coast, port, river);
  if (!selection.length) selection = defineSelection(coast, !port, !river);
  if (!selection.length) selection = defineSelection(!coast, 0, !river);
  if (!selection.length) selection = [burgs[1]]; // select first if nothing is found

  function defineSelection(coast, port, river) {
    if (port && river) return burgs.filter(b => b.port && cells.r[b.cell]);
    if (!port && coast && river) return burgs.filter(b => !b.port && cells.t[b.cell] === 1 && cells.r[b.cell]);
    if (!coast && !river) return burgs.filter(b => cells.t[b.cell] !== 1 && !cells.r[b.cell]);
    if (!coast && river) return burgs.filter(b => cells.t[b.cell] !== 1 && cells.r[b.cell]);
    if (coast && river) return burgs.filter(b => cells.t[b.cell] === 1 && cells.r[b.cell]);
    return [];
  }

  // select a burg with closest population from selection
  const selected = d3.scan(selection, (a, b) => Math.abs(a.population - size) - Math.abs(b.population - size));
  const burgId = selection[selected].i;
  if (!burgId) {
    ERROR && console.error("Cannot select a burg for MFCG");
    return;
  }

  const b = burgs[burgId];
  const referrer = new URL(document.referrer);
  for (let p of referrer.searchParams) {
    if (p[0] === "name") b.name = p[1];
    else if (p[0] === "size") b.population = +p[1];
    else if (p[0] === "seed") b.MFCG = +p[1];
    else if (p[0] === "shantytown") b.shanty = +p[1];
    else b[p[0]] = +p[1]; // other parameters
  }
  if (params.get("name") && params.get("name") != "null") b.name = params.get("name");

  const label = burgLabels.select("[data-id='" + burgId + "']");
  if (label.size()) {
    label
      .text(b.name)
      .classed("drag", true)
      .on("mouseover", function () {
        d3.select(this).classed("drag", false);
        label.on("mouseover", null);
      });
  }

  zoomTo(b.x, b.y, 8, 1600);
  invokeActiveZooming();
  tip("Here stands the glorious city of " + b.name, true, "success", 15000);
}

// Zoom to a specific point
function zoomTo(x, y, z = 8, d = 2000) {
  const transform = d3.zoomIdentity.translate(x * -z + svgWidth / 2, y * -z + svgHeight / 2).scale(z);
  svg.transition().duration(d).call(zoom.transform, transform);
}

// Reset zoom to initial
function resetZoom(d = 1000) {
  svg.transition().duration(d).call(zoom.transform, d3.zoomIdentity);
}

// active zooming feature
function invokeActiveZooming() {
  const isOptimized = shapeRendering.value === "optimizeSpeed";

  if (coastline.select("#sea_island").size() && +coastline.select("#sea_island").attr("auto-filter")) {
    // toggle shade/blur filter for coatline on zoom
    const filter = scale > 1.5 && scale <= 2.6 ? null : scale > 2.6 ? "url(#blurFilter)" : "url(#dropShadow)";
    coastline.select("#sea_island").attr("filter", filter);
  }

  // rescale labels on zoom
  if (labels.style("display") !== "none") {
    labels.selectAll("g").each(function () {
      if (this.id === "burgLabels") return;
      const desired = +this.dataset.size;
      const relative = Math.max(rn((desired + desired / scale) / 2, 2), 1);
      if (rescaleLabels.checked) this.setAttribute("font-size", relative);

      const hidden = hideLabels.checked && (relative * scale < 6 || relative * scale > 60);
      if (hidden) this.classList.add("hidden");
      else this.classList.remove("hidden");
    });
  }

  // rescale emblems on zoom
  if (emblems.style("display") !== "none") {
    emblems.selectAll("g").each(function () {
      const size = this.getAttribute("font-size") * scale;
      const hidden = hideEmblems.checked && (size < 25 || size > 300);
      if (hidden) this.classList.add("hidden");
      else this.classList.remove("hidden");
      if (!hidden && window.COArenderer && this.children.length && !this.children[0].getAttribute("href"))
        renderGroupCOAs(this);
    });
  }

  // change states halo width
  if (!customization && !isOptimized) {
    const desired = +statesHalo.attr("data-width");
    const haloSize = rn(desired / scale ** 0.8, 2);
    statesHalo.attr("stroke-width", haloSize).style("display", haloSize > 0.1 ? "block" : "none");
  }

  // rescale map markers
  +markers.attr("rescale") &&
    pack.markers?.forEach(marker => {
      const {i, x, y, size = 30, hidden} = marker;
      const el = !hidden && byId(`marker${i}`);
      if (!el) return;

      const zoomedSize = Math.max(rn(size / 5 + 24 / scale, 2), 1);
      el.setAttribute("width", zoomedSize);
      el.setAttribute("height", zoomedSize);
      el.setAttribute("x", rn(x - zoomedSize / 2, 1));
      el.setAttribute("y", rn(y - zoomedSize, 1));
    });

  // rescale rulers to have always the same size
  if (ruler.style("display") !== "none") {
    const size = rn((10 / scale ** 0.3) * 2, 2);
    ruler.selectAll("text").attr("font-size", size);
  }
}

// add drag to upload logic, pull request from @evyatron
void (function addDragToUpload() {
  document.addEventListener("dragover", function (e) {
    e.stopPropagation();
    e.preventDefault();
    byId("mapOverlay").style.display = null;
  });

  document.addEventListener("dragleave", function (e) {
    byId("mapOverlay").style.display = "none";
  });

  document.addEventListener("drop", function (e) {
    e.stopPropagation();
    e.preventDefault();

    const overlay = byId("mapOverlay");
    overlay.style.display = "none";

    // Settlement-palette drops from the parent React app arrive here because
    // drag events inside an iframe don't bubble to the parent document. Detect
    // our drag type, convert screen→map coords, and forward the placement so
    // the parent's store/overlay gets the icon. Falls through to FMG's file
    // upload path only if this isn't a settlementforge drag.
    try {
      var _types = [];
      try {
        if (e.dataTransfer && e.dataTransfer.types) {
          _types = Array.prototype.slice.call(e.dataTransfer.types);
        }
      } catch (_) {}
      console.log('[sfBridge] drop types:', _types);
      var sfPayload = e.dataTransfer && e.dataTransfer.getData
        ? e.dataTransfer.getData('application/settlementforge')
        : '';
      if (sfPayload) {
        console.log('[sfBridge] sf drop payload:', sfPayload);
        var sfData = null;
        try { sfData = JSON.parse(sfPayload); } catch (_) { sfData = null; }
        if (sfData && sfData.id) {
          var rect = document.getElementById('map')
            ? document.getElementById('map').getBoundingClientRect()
            : { left: 0, top: 0 };
          var sx = e.clientX - rect.left;
          var sy = e.clientY - rect.top;
          console.log('[sfBridge] drop coords raw:', { clientX: e.clientX, clientY: e.clientY, rectLeft: rect.left, rectTop: rect.top, sx: sx, sy: sy });
          var mapPt = null;
          try {
            var _s2m = window.__sfScreenToMap;
            mapPt = (typeof _s2m === 'function') ? _s2m(sx, sy) : null;
          } catch (err) {
            console.warn('[sfBridge] screenToMap threw:', err);
          }
          console.log('[sfBridge] mapPt:', mapPt, 'screenToMapAvailable:', typeof window.__sfScreenToMap);
          if (mapPt) {
            var syntheticBurgId = 'sf_' + sfData.id + '_' + Date.now().toString(36);
            var cellId = null;
            try {
              if (typeof findCell === 'function' && window.pack && pack.cells) {
                cellId = findCell(mapPt.x, mapPt.y);
              }
            } catch (_) { cellId = null; }
            try {
              var msg = {
                type: 'fmg:settlementPlaced',
                burgId: syntheticBurgId,
                settlementId: sfData.id,
                name: sfData.name,
                x: mapPt.x,
                y: mapPt.y,
                cellId: cellId,
              };
              console.log('[sfBridge] posting to parent:', msg);
              window.parent && window.parent.postMessage(msg, '*');
            } catch (err) {
              console.warn('[sfBridge] postMessage failed:', err);
            }
          } else {
            console.warn('[sfBridge] no mapPt — drop ignored');
          }
        } else {
          console.warn('[sfBridge] sf drop had no sfData.id:', sfData);
        }
        return;
      }
    } catch (err) {
      console.warn('[sfBridge] sf drop handler threw:', err);
    }

    if (e.dataTransfer.items == null || e.dataTransfer.items.length !== 1) return; // no files or more than one
    const file = e.dataTransfer.items[0].getAsFile();
    if (!file) return; // non-file drag (e.g. text/url) — not ours to handle

    if (!file.name.endsWith(".map") && !file.name.endsWith(".gz")) {
      alertMessage.innerHTML =
        "Please upload a map file (<i>.map</i> or <i>.gz</i> formats) you have previously downloaded";
      $("#alert").dialog({
        resizable: false,
        title: "Invalid file format",
        position: {my: "center", at: "center", of: "svg"},
        buttons: {
          Close: function () {
            $(this).dialog("close");
          }
        }
      });
      return;
    }

    // all good - show uploading text and load the map
    overlay.style.display = null;
    overlay.innerHTML = "Uploading<span>.</span><span>.</span><span>.</span>";
    if (closeDialogs) closeDialogs();
    uploadMap(file, () => {
      overlay.style.display = "none";
      overlay.innerHTML = "Drop a map file to open";
    });
  });
})();

async function generate(options) {
  try {
    const timeStart = performance.now();
    const {seed: precreatedSeed, graph: precreatedGraph} = options || {};

    invokeActiveZooming();
    setSeed(precreatedSeed);
    INFO && console.group("Generated Map " + seed);

    applyGraphSize();
    randomizeOptions();

    if (shouldRegenerateGrid(grid, precreatedSeed)) grid = precreatedGraph || generateGrid();
    else delete grid.cells.h;
    grid.cells.h = await HeightmapGenerator.generate(grid);
    pack = {}; // reset pack

    Features.markupGrid();
    addLakesInDeepDepressions();
    openNearSeaLakes();

    OceanLayers();
    defineMapSize();
    calculateMapCoordinates();
    calculateTemperatures();
    generatePrecipitation();

    reGraph();
    Features.markupPack();
    createDefaultRuler();

    Rivers.generate();
    Biomes.define();
    Features.defineGroups();

    Ice.generate();

    rankCells();
    Cultures.generate();
    Cultures.expand();

    Settlements.generate();
    States.generate();
    Routes.generate();
    Religions.generate();

    Settlements.specify();
    States.collectStatistics();
    States.defineStateForms();

    Provinces.generate();
    Provinces.getPoles();

    Rivers.specify();
    Lakes.defineNames();

    Military.generate();
    Markers.generate();
    Zones.generate();

    drawScaleBar(scaleBar, scale);
    Names.getMapName();

    WARN && console.warn(`TOTAL: ${rn((performance.now() - timeStart) / 1000, 2)}s`);
    showStatistics();
    INFO && console.groupEnd("Generated Map " + seed);
  } catch (error) {
    ERROR && console.error(error);
    const parsedError = parseError(error);
    clearMainTip();

    alertMessage.innerHTML = /* html */ `An error has occurred on map generation. Please retry. <br />If error is critical, clear the stored data and try again.
      <p id="errorBox">${parsedError}</p>`;
    $("#alert").dialog({
      resizable: false,
      title: "Generation error",
      width: "32em",
      buttons: {
        "Cleanup data": () => cleanupData(),
        Regenerate: function () {
          regenerateMap("generation error");
          $(this).dialog("close");
        },
        Ignore: function () {
          $(this).dialog("close");
        }
      },
      position: {my: "center", at: "center", of: "svg"}
    });
  }
}

// set map seed (string!)
function setSeed(precreatedSeed) {
  if (!precreatedSeed) {
    const first = !mapHistory[0];
    const params = new URL(window.location.href).searchParams;
    const urlSeed = params.get("seed");
    if (first && params.get("from") === "MFCG" && urlSeed.length === 13) seed = urlSeed.slice(0, -4);
    else if (first && urlSeed) seed = urlSeed;
    else seed = generateSeed();
  } else {
    seed = precreatedSeed;
  }

  byId("optionsSeed").value = seed;
  Math.random = aleaPRNG(seed);
}

function addLakesInDeepDepressions() {
  TIME && console.time("addLakesInDeepDepressions");
  const elevationLimit = +byId("lakeElevationLimitOutput").value;
  if (elevationLimit === 80) return;

  const {cells, features} = grid;
  const {c, h, b} = cells;

  for (const i of cells.i) {
    if (b[i] || h[i] < 20) continue;

    const minHeight = d3.min(c[i].map(c => h[c]));
    if (h[i] > minHeight) continue;

    let deep = true;
    const threshold = h[i] + elevationLimit;
    const queue = [i];
    const checked = [];
    checked[i] = true;

    // check if elevated cell can potentially pour to water
    while (deep && queue.length) {
      const q = queue.pop();

      for (const n of c[q]) {
        if (checked[n]) continue;
        if (h[n] >= threshold) continue;
        if (h[n] < 20) {
          deep = false;
          break;
        }

        checked[n] = true;
        queue.push(n);
      }
    }

    // if not, add a lake
    if (deep) {
      const lakeCells = [i].concat(c[i].filter(n => h[n] === h[i]));
      addLake(lakeCells);
    }
  }

  function addLake(lakeCells) {
    const f = features.length;

    lakeCells.forEach(i => {
      cells.h[i] = 19;
      cells.t[i] = -1;
      cells.f[i] = f;
      c[i].forEach(n => !lakeCells.includes(n) && (cells.t[c] = 1));
    });

    features.push({i: f, land: false, border: false, type: "lake"});
  }

  TIME && console.timeEnd("addLakesInDeepDepressions");
}

// near sea lakes usually get a lot of water inflow, most of them should break threshold and flow out to sea (see Ancylus Lake)
function openNearSeaLakes() {
  if (byId("templateInput").value === "Atoll") return; // no need for Atolls

  const cells = grid.cells;
  const features = grid.features;
  if (!features.find(f => f.type === "lake")) return; // no lakes
  TIME && console.time("openLakes");
  const LIMIT = 22; // max height that can be breached by water

  for (const i of cells.i) {
    const lakeFeatureId = cells.f[i];
    if (features[lakeFeatureId].type !== "lake") continue; // not a lake

    check_neighbours: for (const c of cells.c[i]) {
      if (cells.t[c] !== 1 || cells.h[c] > LIMIT) continue; // water cannot break this

      for (const n of cells.c[c]) {
        const ocean = cells.f[n];
        if (features[ocean].type !== "ocean") continue; // not an ocean
        removeLake(c, lakeFeatureId, ocean);
        break check_neighbours;
      }
    }
  }

  function removeLake(thresholdCellId, lakeFeatureId, oceanFeatureId) {
    cells.h[thresholdCellId] = 19;
    cells.t[thresholdCellId] = -1;
    cells.f[thresholdCellId] = oceanFeatureId;
    cells.c[thresholdCellId].forEach(function (c) {
      if (cells.h[c] >= 20) cells.t[c] = 1; // mark as coastline
    });

    cells.i.forEach(i => {
      if (cells.f[i] === lakeFeatureId) cells.f[i] = oceanFeatureId;
    });
    features[lakeFeatureId].type = "ocean"; // mark former lake as ocean
  }

  TIME && console.timeEnd("openLakes");
}

// define map size and position based on template and random factor
function defineMapSize() {
  const [size, latitude, longitude] = getSizeAndLatitude();
  const randomize = new URL(window.location.href).searchParams.get("options") === "default"; // ignore stored options
  if (randomize || !locked("mapSize")) mapSizeOutput.value = mapSizeInput.value = size;
  if (randomize || !locked("latitude")) latitudeOutput.value = latitudeInput.value = latitude;
  if (randomize || !locked("longitude")) longitudeOutput.value = longitudeInput.value = longitude;

  function getSizeAndLatitude() {
    const template = byId("templateInput").value; // heightmap template

    if (template === "africa-centric") return [45, 53, 38];
    if (template === "arabia") return [20, 35, 35];
    if (template === "atlantics") return [42, 23, 65];
    if (template === "britain") return [7, 20, 51.3];
    if (template === "caribbean") return [15, 40, 74.8];
    if (template === "east-asia") return [11, 28, 9.4];
    if (template === "eurasia") return [38, 19, 27];
    if (template === "europe") return [20, 16, 44.8];
    if (template === "europe-accented") return [14, 22, 44.8];
    if (template === "europe-and-central-asia") return [25, 10, 39.5];
    if (template === "europe-central") return [11, 22, 46.4];
    if (template === "europe-north") return [7, 18, 48.9];
    if (template === "greenland") return [22, 7, 55.8];
    if (template === "hellenica") return [8, 27, 43.5];
    if (template === "iceland") return [2, 15, 55.3];
    if (template === "indian-ocean") return [45, 55, 14];
    if (template === "mediterranean-sea") return [10, 29, 45.8];
    if (template === "middle-east") return [8, 31, 34.4];
    if (template === "north-america") return [37, 17, 87];
    if (template === "us-centric") return [66, 27, 100];
    if (template === "us-mainland") return [16, 30, 77.5];
    if (template === "world") return [78, 27, 40];
    if (template === "world-from-pacific") return [75, 32, 30]; // longitude doesn't fit

    const part = grid.features.some(f => f.land && f.border); // if land goes over map borders
    const max = part ? 80 : 100; // max size
    const lat = () => gauss(P(0.5) ? 40 : 60, 20, 25, 75); // latitude shift

    if (!part) {
      if (template === "pangea") return [100, 50, 50];
      if (template === "shattered" && P(0.7)) return [100, 50, 50];
      if (template === "continents" && P(0.5)) return [100, 50, 50];
      if (template === "archipelago" && P(0.35)) return [100, 50, 50];
      if (template === "highIsland" && P(0.25)) return [100, 50, 50];
      if (template === "lowIsland" && P(0.1)) return [100, 50, 50];
    }

    if (template === "pangea") return [gauss(70, 20, 30, max), lat(), 50];
    if (template === "volcano") return [gauss(20, 20, 10, max), lat(), 50];
    if (template === "mediterranean") return [gauss(25, 30, 15, 80), lat(), 50];
    if (template === "peninsula") return [gauss(15, 15, 5, 80), lat(), 50];
    if (template === "isthmus") return [gauss(15, 20, 3, 80), lat(), 50];
    if (template === "atoll") return [gauss(3, 2, 1, 5, 1), lat(), 50];

    return [gauss(30, 20, 15, max), lat(), 50]; // Continents, Archipelago, High Island, Low Island
  }
}

// calculate map position on globe
function calculateMapCoordinates() {
  const sizeFraction = +byId("mapSizeOutput").value / 100;
  const latShift = +byId("latitudeOutput").value / 100;
  const lonShift = +byId("longitudeOutput").value / 100;

  const latT = rn(sizeFraction * 180, 1);
  const latN = rn(90 - (180 - latT) * latShift, 1);
  const latS = rn(latN - latT, 1);

  const lonT = rn(Math.min((graphWidth / graphHeight) * latT, 360), 1);
  const lonE = rn(180 - (360 - lonT) * lonShift, 1);
  const lonW = rn(lonE - lonT, 1);
  mapCoordinates = {latT, latN, latS, lonT, lonW, lonE};
}

// temperature model, trying to follow real-world data
// based on http://www-das.uwyo.edu/~geerts/cwx/notes/chap16/Image64.gif
function calculateTemperatures() {
  TIME && console.time("calculateTemperatures");
  const cells = grid.cells;
  cells.temp = new Int8Array(cells.i.length); // temperature array

  const {temperatureEquator, temperatureNorthPole, temperatureSouthPole} = options;
  const tropics = [16, -20]; // tropics zone
  const tropicalGradient = 0.15;

  const tempNorthTropic = temperatureEquator - tropics[0] * tropicalGradient;
  const northernGradient = (tempNorthTropic - temperatureNorthPole) / (90 - tropics[0]);

  const tempSouthTropic = temperatureEquator + tropics[1] * tropicalGradient;
  const southernGradient = (tempSouthTropic - temperatureSouthPole) / (90 + tropics[1]);

  const exponent = +heightExponentInput.value;

  for (let rowCellId = 0; rowCellId < cells.i.length; rowCellId += grid.cellsX) {
    const [, y] = grid.points[rowCellId];
    const rowLatitude = mapCoordinates.latN - (y / graphHeight) * mapCoordinates.latT; // [90; -90]
    const tempSeaLevel = calculateSeaLevelTemp(rowLatitude);
    DEBUG.temperature && console.info(`${rn(rowLatitude)}° sea temperature: ${rn(tempSeaLevel)}°C`);

    for (let cellId = rowCellId; cellId < rowCellId + grid.cellsX; cellId++) {
      const tempAltitudeDrop = getAltitudeTemperatureDrop(cells.h[cellId]);
      cells.temp[cellId] = minmax(tempSeaLevel - tempAltitudeDrop, -128, 127);
    }
  }

  function calculateSeaLevelTemp(latitude) {
    const isTropical = latitude <= 16 && latitude >= -20;
    if (isTropical) return temperatureEquator - Math.abs(latitude) * tropicalGradient;

    return latitude > 0
      ? tempNorthTropic - (latitude - tropics[0]) * northernGradient
      : tempSouthTropic + (latitude - tropics[1]) * southernGradient;
  }

  // temperature drops by 6.5°C per 1km of altitude
  function getAltitudeTemperatureDrop(h) {
    if (h < 20) return 0;
    const height = Math.pow(h - 18, exponent);
    return rn((height / 1000) * 6.5);
  }

  TIME && console.timeEnd("calculateTemperatures");
}

// simplest precipitation model
function generatePrecipitation() {
  TIME && console.time("generatePrecipitation");
  prec.selectAll("*").remove();
  const {cells, cellsX, cellsY} = grid;
  cells.prec = new Uint8Array(cells.i.length); // precipitation array

  const cellsNumberModifier = (pointsInput.dataset.cells / 10000) ** 0.25;
  const precInputModifier = precInput.value / 100;
  const modifier = cellsNumberModifier * precInputModifier;

  const westerly = [];
  const easterly = [];
  let southerly = 0;
  let northerly = 0;

  // precipitation modifier per latitude band
  // x4 = 0-5 latitude: wet through the year (rising zone)
  // x2 = 5-20 latitude: wet summer (rising zone), dry winter (sinking zone)
  // x1 = 20-30 latitude: dry all year (sinking zone)
  // x2 = 30-50 latitude: wet winter (rising zone), dry summer (sinking zone)
  // x3 = 50-60 latitude: wet all year (rising zone)
  // x2 = 60-70 latitude: wet summer (rising zone), dry winter (sinking zone)
  // x1 = 70-85 latitude: dry all year (sinking zone)
  // x0.5 = 85-90 latitude: dry all year (sinking zone)
  const latitudeModifier = [4, 2, 2, 2, 1, 1, 2, 2, 2, 2, 3, 3, 2, 2, 1, 1, 1, 0.5];
  const MAX_PASSABLE_ELEVATION = 85;

  // define wind directions based on cells latitude and prevailing winds there
  d3.range(0, cells.i.length, cellsX).forEach(function (c, i) {
    const lat = mapCoordinates.latN - (i / cellsY) * mapCoordinates.latT;
    const latBand = ((Math.abs(lat) - 1) / 5) | 0;
    const latMod = latitudeModifier[latBand];
    const windTier = (Math.abs(lat - 89) / 30) | 0; // 30d tiers from 0 to 5 from N to S
    const {isWest, isEast, isNorth, isSouth} = getWindDirections(windTier);

    if (isWest) westerly.push([c, latMod, windTier]);
    if (isEast) easterly.push([c + cellsX - 1, latMod, windTier]);
    if (isNorth) northerly++;
    if (isSouth) southerly++;
  });

  // distribute winds by direction
  if (westerly.length) passWind(westerly, 120 * modifier, 1, cellsX);
  if (easterly.length) passWind(easterly, 120 * modifier, -1, cellsX);

  const vertT = southerly + northerly;
  if (northerly) {
    const bandN = ((Math.abs(mapCoordinates.latN) - 1) / 5) | 0;
    const latModN = mapCoordinates.latT > 60 ? d3.mean(latitudeModifier) : latitudeModifier[bandN];
    const maxPrecN = (northerly / vertT) * 60 * modifier * latModN;
    passWind(d3.range(0, cellsX, 1), maxPrecN, cellsX, cellsY);
  }

  if (southerly) {
    const bandS = ((Math.abs(mapCoordinates.latS) - 1) / 5) | 0;
    const latModS = mapCoordinates.latT > 60 ? d3.mean(latitudeModifier) : latitudeModifier[bandS];
    const maxPrecS = (southerly / vertT) * 60 * modifier * latModS;
    passWind(d3.range(cells.i.length - cellsX, cells.i.length, 1), maxPrecS, -cellsX, cellsY);
  }

  function getWindDirections(tier) {
    const angle = options.winds[tier];

    const isWest = angle > 40 && angle < 140;
    const isEast = angle > 220 && angle < 320;
    const isNorth = angle > 100 && angle < 260;
    const isSouth = angle > 280 || angle < 80;

    return {isWest, isEast, isNorth, isSouth};
  }

  function passWind(source, maxPrec, next, steps) {
    const maxPrecInit = maxPrec;

    for (let first of source) {
      if (first[0]) {
        maxPrec = Math.min(maxPrecInit * first[1], 255);
        first = first[0];
      }

      let humidity = maxPrec - cells.h[first]; // initial water amount
      if (humidity <= 0) continue; // if first cell in row is too elevated consider wind dry

      for (let s = 0, current = first; s < steps; s++, current += next) {
        if (cells.temp[current] < -5) continue; // no flux in permafrost

        if (cells.h[current] < 20) {
          // water cell
          if (cells.h[current + next] >= 20) {
            cells.prec[current + next] += Math.max(humidity / rand(10, 20), 1); // coastal precipitation
          } else {
            humidity = Math.min(humidity + 5 * modifier, maxPrec); // wind gets more humidity passing water cell
            cells.prec[current] += 5 * modifier; // water cells precipitation (need to correctly pour water through lakes)
          }
          continue;
        }

        // land cell
        const isPassable = cells.h[current + next] <= MAX_PASSABLE_ELEVATION;
        const precipitation = isPassable ? getPrecipitation(humidity, current, next) : humidity;
        cells.prec[current] += precipitation;
        const evaporation = precipitation > 1.5 ? 1 : 0; // some humidity evaporates back to the atmosphere
        humidity = isPassable ? minmax(humidity - precipitation + evaporation, 0, maxPrec) : 0;
      }
    }
  }

  function getPrecipitation(humidity, i, n) {
    const normalLoss = Math.max(humidity / (10 * modifier), 1); // precipitation in normal conditions
    const diff = Math.max(cells.h[i + n] - cells.h[i], 0); // difference in height
    const mod = (cells.h[i + n] / 70) ** 2; // 50 stands for hills, 70 for mountains
    return minmax(normalLoss + diff * mod, 1, humidity);
  }

  void (function drawWindDirection() {
    const wind = prec.append("g").attr("id", "wind");

    d3.range(0, 6).forEach(function (t) {
      if (westerly.length > 1) {
        const west = westerly.filter(w => w[2] === t);
        if (west && west.length > 3) {
          const from = west[0][0],
            to = west[west.length - 1][0];
          const y = (grid.points[from][1] + grid.points[to][1]) / 2;
          wind.append("text").attr("text-rendering", "optimizeSpeed").attr("x", 20).attr("y", y).text("\u21C9");
        }
      }
      if (easterly.length > 1) {
        const east = easterly.filter(w => w[2] === t);
        if (east && east.length > 3) {
          const from = east[0][0],
            to = east[east.length - 1][0];
          const y = (grid.points[from][1] + grid.points[to][1]) / 2;
          wind
            .append("text")
            .attr("text-rendering", "optimizeSpeed")
            .attr("x", graphWidth - 52)
            .attr("y", y)
            .text("\u21C7");
        }
      }
    });

    if (northerly)
      wind
        .append("text")
        .attr("text-rendering", "optimizeSpeed")
        .attr("x", graphWidth / 2)
        .attr("y", 42)
        .text("\u21CA");
    if (southerly)
      wind
        .append("text")
        .attr("text-rendering", "optimizeSpeed")
        .attr("x", graphWidth / 2)
        .attr("y", graphHeight - 20)
        .text("\u21C8");
  })();

  TIME && console.timeEnd("generatePrecipitation");
}

// recalculate Voronoi Graph to pack cells
function reGraph() {
  TIME && console.time("reGraph");
  const {cells: gridCells, points, features} = grid;
  const newCells = {p: [], g: [], h: []}; // store new data
  const spacing2 = grid.spacing ** 2;

  for (const i of gridCells.i) {
    const height = gridCells.h[i];
    const type = gridCells.t[i];

    if (height < 20 && type !== -1 && type !== -2) continue; // exclude all deep ocean points
    if (type === -2 && (i % 4 === 0 || features[gridCells.f[i]].type === "lake")) continue; // exclude non-coastal lake points

    const [x, y] = points[i];
    addNewPoint(i, x, y, height);

    // add additional points for cells along coast
    if (type === 1 || type === -1) {
      if (gridCells.b[i]) continue; // not for near-border cells
      gridCells.c[i].forEach(function (e) {
        if (i > e) return;
        if (gridCells.t[e] === type) {
          const dist2 = (y - points[e][1]) ** 2 + (x - points[e][0]) ** 2;
          if (dist2 < spacing2) return; // too close to each other
          const x1 = rn((x + points[e][0]) / 2, 1);
          const y1 = rn((y + points[e][1]) / 2, 1);
          addNewPoint(i, x1, y1, height);
        }
      });
    }
  }

  function addNewPoint(i, x, y, height) {
    newCells.p.push([x, y]);
    newCells.g.push(i);
    newCells.h.push(height);
  }

  const {cells: packCells, vertices} = calculateVoronoi(newCells.p, grid.boundary);
  pack.vertices = vertices;
  pack.cells = packCells;
  pack.cells.p = newCells.p;
  pack.cells.g = createTypedArray({maxValue: grid.points.length, from: newCells.g});
  pack.cells.h = createTypedArray({maxValue: 100, from: newCells.h});
  pack.cells.area = createTypedArray({maxValue: UINT16_MAX, length: packCells.i.length}).map((_, cellId) => {
    const area = Math.abs(d3.polygonArea(getPackPolygon(cellId)));
    return Math.min(area, UINT16_MAX);
  });

  TIME && console.timeEnd("reGraph");
}

function isWetLand(moisture, temperature, height) {
  if (moisture > 40 && temperature > -2 && height < 25) return true; //near coast
  if (moisture > 24 && temperature > -2 && height > 24 && height < 60) return true; //off coast
  return false;
}

// assess cells suitability to calculate population and rand cells for culture center and burgs placement
function rankCells() {
  TIME && console.time("rankCells");
  const {cells, features} = pack;
  cells.s = new Int16Array(cells.i.length); // cell suitability array
  cells.pop = new Float32Array(cells.i.length); // cell population array

  const meanFlux = d3.median(cells.fl.filter(f => f)) || 0;
  const maxFlux = d3.max(cells.fl) + d3.max(cells.conf); // to normalize flux
  const meanArea = d3.mean(cells.area); // to adjust population by cell area

  const scoreMap = {
    estuary: 15,
    ocean_coast: 5,
    save_harbor: 20,
    freshwater: 30,
    salt: 10,
    frozen: 1,
    dry: -5,
    sinkhole: -5,
    lava: -30
  };

  for (const i of cells.i) {
    if (cells.h[i] < 20) continue; // no population in water
    let score = biomesData.habitability[cells.biome[i]]; // base suitability derived from biome habitability
    if (!score) continue; // uninhabitable biomes has 0 suitability

    if (meanFlux) score += normalize(cells.fl[i] + cells.conf[i], meanFlux, maxFlux) * 250; // big rivers and confluences are valued
    score -= (cells.h[i] - 50) / 5; // low elevation is valued, high is not;

    if (cells.t[i] === 1) {
      if (cells.r[i]) score += scoreMap.estuary;
      const feature = features[cells.f[cells.haven[i]]];
      if (feature.type === "lake") {
        score += scoreMap[feature.group] || 0;
      } else {
        score += scoreMap.ocean_coast;
        if (cells.harbor[i] === 1) score += scoreMap.save_harbor;
      }
    }

    cells.s[i] = score / 5; // general population rate
    // cell rural population is suitability adjusted by cell area
    cells.pop[i] = cells.s[i] > 0 ? (cells.s[i] * cells.area[i]) / meanArea : 0;
  }

  TIME && console.timeEnd("rankCells");
}

// show map stats on generation complete
function showStatistics() {
  const heightmap = byId("templateInput").value;
  const isTemplate = heightmap in heightmapTemplates;
  const heightmapType = isTemplate ? "template" : "precreated";
  const isRandomTemplate = isTemplate && !locked("template") ? "random " : "";

  const stats = `  Seed: ${seed}
    Canvas size: ${graphWidth}x${graphHeight} px
    Heightmap: ${heightmap}
    Template: ${isRandomTemplate}${heightmapType}
    Points: ${grid.points.length}
    Cells: ${pack.cells.i.length}
    Map size: ${mapSizeOutput.value}%
    States: ${pack.states.length - 1}
    Provinces: ${pack.provinces.length - 1}
    Settlements: ${pack.burgs.length - 1}
    Religions: ${pack.religions.length - 1}
    Culture set: ${culturesSet.value}
    Cultures: ${pack.cultures.length - 1}`;

  mapId = Date.now(); // unique map id is it's creation date number
  window.mapId = mapId; // expose for test automation
  mapHistory.push({seed, width: graphWidth, height: graphHeight, template: heightmap, created: mapId});
  INFO && console.info(stats);

  // Dispatch event for test automation and external integrations
  window.dispatchEvent(new CustomEvent("map:generated", {detail: {seed, mapId}}));
}

const regenerateMap = debounce(async function (options) {
  WARN && console.warn("Generate new random map");

  const cellsDesired = +byId("pointsInput").dataset.cells;
  const shouldShowLoading = cellsDesired > 10000;
  shouldShowLoading && showLoading();

  closeDialogs("#worldConfigurator, #options3d");
  customization = 0;
  resetZoom(1000);
  undraw();
  await generate(options);
  drawLayers();
  if (ThreeD.options.isOn) ThreeD.redraw();
  if ($("#worldConfigurator").is(":visible")) editWorld();

  fitMapToScreen();
  shouldShowLoading && hideLoading();
  clearMainTip();
}, 250);

// clear the map
function undraw() {
  viewbox
    .selectAll("path, circle, polygon, line, text, use, #texture > image, #zones > g, #armies > g, #ruler > g")
    .remove();
  byId("deftemp")
    .querySelectorAll("path, clipPath, svg")
    .forEach(el => el.remove());
  byId("coas").innerHTML = ""; // remove auto-generated emblems
  notes = [];
  unfog();
}

// ── SettlementForge postMessage Bridge (v2) ────────────────────────────────
// Typed RPC with request-id correlation between the embedded FMG iframe and
// the parent SettlementForge app.
//
// Every command FROM the parent carries an opaque `_rid`. Replies echo the
// `_rid` with either the reply payload or `{ _error: "..." }`. Push events
// have no `_rid`.
//
// Commands (parent → FMG):
//   settlementEngine:requestBurgList
//   settlementEngine:placeSettlement     { settlementId, x, y, name, population }
//   settlementEngine:removePlacement     { burgId }
//   settlementEngine:restorePlacements   { placements }
//   settlementEngine:clearAllPlacements
//   settlementEngine:getViewport
//   settlementEngine:setViewport         { cx, cy, scale, duration }
//   settlementEngine:fitMap
//   settlementEngine:saveSnapshot
//   settlementEngine:loadSnapshot        { snapshot }
//   settlementEngine:resetMap            { seed }
//   settlementEngine:activateTool        { tool, options }
//   settlementEngine:deactivateTool
//   settlementEngine:terrainUndo
//   settlementEngine:terrainRedo
//   settlementEngine:setEmbeddedMode     { enabled }
//
// Push events (FMG → parent):
//   fmg:ready          { seed, width, height }
//   fmg:burgSelected   { burg }
//   fmg:burgList       { burgs }
//   fmg:viewport       { cx, cy, scale, width, height }   [throttled ~60fps]
//   fmg:mapReset       { seed }
//   fmg:snapshotLoaded
//   fmg:terrainChanged { tool }
//
// The React overlay layer (src/components/MapOverlay.jsx) sits on top of the
// iframe and owns all relationship/chain/label/marker/forest rendering. The
// FMG bridge no longer draws overlays itself.

(function initSettlementForgeBridge() {
  const isEmbedded = window.parent !== window;
  if (!isEmbedded) return;

  // Apply SettlementForge chrome palette class
  document.body.classList.add('sf-embedded');

  // Track user-placed burgs (ids only) — only these are visible in embedded
  // mode and only these are reported back to the parent in the burg list.
  window.__sfPlacedBurgIds = window.__sfPlacedBurgIds || new Set();

  let readyNotified = false;
  let viewportRafPending = false;
  let lastViewportTx = null;

  // ══════════════════════════════════════════════════════════════════════════
  // SettlementForge Embedded-Mode Overrides
  //
  // Goal: FMG generates GEOGRAPHY ONLY — terrain, rivers, coastlines, biomes.
  // No pre-populated settlements, states, routes, religions, military, etc.
  // Template is locked to single-landmass / island-cluster shapes.
  // ══════════════════════════════════════════════════════════════════════════

  // Curated single-landmass templates (no Strait operations that split continents)
  const SF_TEMPLATES = {
    highIsland:  { label: 'Mountainous Island' },
    lowIsland:   { label: 'Low Island' },
    volcano:     { label: 'Volcanic Island' },
    peninsula:   { label: 'Peninsula' },
    pangea:      { label: 'Supercontinent' },
    atoll:       { label: 'Atoll' },
  };

  // Custom template: clustered island chain (Philippines / Indonesia style).
  // Builds central landmass, adds surrounding hills, troughs carve channels
  // between islands, mask removes low-elevation land to create gaps.
  // No Strait operations — islands stay close together.
  const SF_ARCHIPELAGO_TEMPLATE = `Hill 1 85-95 45-55 35-65
    Hill 5-7 25-40 15-85 15-85
    Range 1-2 35-55 25-75 25-75
    Smooth 2 0 0 0
    Trough 10-14 20-35 10-90 10-90
    Multiply 0.5 20-100 0 0
    Mask 4 0 0 0`;

  // Register our custom template into FMG's heightmapTemplates object
  if (typeof heightmapTemplates !== 'undefined') {
    heightmapTemplates.sfArchipelago = {
      id: 99,
      name: 'Island Chain',
      template: SF_ARCHIPELAGO_TEMPLATE,
      probability: 0,  // never picked randomly — only via explicit selection
    };
    SF_TEMPLATES.sfArchipelago = { label: 'Island Chain' };
  }

  // Which template the user has requested (null = pick randomly from curated list)
  window.__sfRequestedTemplate = null;

  function sfPickTemplate() {
    const keys = Object.keys(SF_TEMPLATES);
    return keys[Math.floor(Math.random() * keys.length)];
  }

  // ── Override FMG's randomizeOptions to force empty-world generation ──────
  // This runs synchronously BEFORE DOMContentLoaded (before generate() fires).
  const _origRandomize = window.randomizeOptions;
  window.randomizeOptions = function () {
    // Let FMG set its defaults first
    if (typeof _origRandomize === 'function') _origRandomize.apply(this, arguments);

    // Force single-landmass template
    const tmpl = window.__sfRequestedTemplate || sfPickTemplate();
    if (typeof heightmapTemplates !== 'undefined' && heightmapTemplates[tmpl]) {
      const el = document.getElementById('templateInput');
      if (el && typeof applyOption === 'function') {
        applyOption(el, tmpl, heightmapTemplates[tmpl].name);
      }
    }

    // Zero out civilization — FMG generates geography only
    const sn = document.getElementById('statesNumber');
    if (sn) sn.value = 0;
    const mi = document.getElementById('manorsInput');
    const mo = document.getElementById('manorsOutput');
    if (mi) mi.value = 0;
    if (mo) mo.value = '0';
    const rn_ = document.getElementById('religionsNumber');
    if (rn_) rn_.value = 0;
    const pr = document.getElementById('provincesRatio');
    if (pr) pr.value = 0;
  };

  // ── Scale map canvas to fill the iframe viewport ────────────────────────
  // FMG defaults to 960×540. We resize to fill the iframe so the map
  // renders at the correct aspect ratio without empty margins.
  function scaleCanvasToViewport() {
    const w = window.innerWidth || 960;
    const h = window.innerHeight || 540;
    const mw = document.getElementById('mapWidthInput');
    const mh = document.getElementById('mapHeightInput');
    if (mw) mw.value = w;
    if (mh) mh.value = h;
  }
  // Apply before generation runs
  scaleCanvasToViewport();

  // ── Styles: hide ALL political/civilization layers ──────────────────────
  function injectEmbeddedStyles() {
    if (document.getElementById('sf-embedded-styles')) return;
    const style = document.createElement('style');
    style.id = 'sf-embedded-styles';
    style.textContent = `
      /* Hide ALL native FMG burgs — settlement icons are drawn by the
         React overlay (PlacementsLayer) using app-tier styling. */
      body.sf-embedded #burgIcons,
      body.sf-embedded #burgLabels,
      body.sf-embedded #anchors,
      body.sf-embedded #icons #burgIcons {
        display: none !important;
      }
      /* Hide all civilization layers — we only want geography */
      body.sf-embedded #routes { display: none !important; }
      body.sf-embedded #burgEmblems { display: none !important; }
      body.sf-embedded #fogging-cont { display: none !important; }
      body.sf-embedded #borders { display: none !important; }
      body.sf-embedded #statesHalo { display: none !important; }
      body.sf-embedded #labels { display: none !important; }
      body.sf-embedded #markers { display: none !important; }
      body.sf-embedded #zones { display: none !important; }
      body.sf-embedded #armies { display: none !important; }
      body.sf-embedded #emblems { display: none !important; }
      body.sf-embedded #rulers { display: none !important; }
      /* FMG UI chrome — hide everything except the SVG map */
      body.sf-embedded #optionsContainer { display: none !important; }
      body.sf-embedded #tooltip { display: none !important; }
      body.sf-embedded #loading { display: none !important; }
      /* Map cursor */
      body.sf-embedded #map { cursor: default; }
      /* Ensure the SVG fills the viewport */
      body.sf-embedded #map {
        position: absolute !important;
        top: 0; left: 0;
        width: 100% !important;
        height: 100% !important;
      }
    `;
    document.head.appendChild(style);
  }
  injectEmbeddedStyles();

  // ── DOM tagging for user-placed burgs ───────────────────────────────────
  function tagPlacedBurg(burgId) {
    if (burgId == null) return;
    window.__sfPlacedBurgIds.add(burgId);
    const circle = document.querySelector(`#burgIcons circle[data-id="${burgId}"]`);
    if (circle) circle.setAttribute('data-sf-placed', 'true');
    const label = document.querySelector(`#burgLabels text[data-id="${burgId}"]`);
    if (label) label.setAttribute('data-sf-placed', 'true');
    const anchor = document.querySelector(`#anchors use[data-id="${burgId}"]`);
    if (anchor) anchor.setAttribute('data-sf-placed', 'true');
  }

  function retagAllPlaced() {
    if (!window.__sfPlacedBurgIds?.size) return;
    for (const id of window.__sfPlacedBurgIds) tagPlacedBurg(id);
  }

  // Expose for other FMG code that runs synchronously during redraws.
  window.__sfRetagPlaced = retagAllPlaced;

  // Auto-retag on DOM mutation so we don't have to remember retagAllPlaced()
  // after every FMG operation that rebuilds burg nodes.
  let mutationObserver = null;
  let retagScheduled = false;
  function scheduleRetag() {
    if (retagScheduled) return;
    retagScheduled = true;
    queueMicrotask(() => {
      retagScheduled = false;
      retagAllPlaced();
    });
  }
  function installMutationObservers() {
    if (mutationObserver) return;
    const targets = ['burgIcons', 'burgLabels', 'anchors']
      .map(id => document.getElementById(id))
      .filter(Boolean);
    if (!targets.length) return;
    mutationObserver = new MutationObserver(scheduleRetag);
    for (const t of targets) {
      mutationObserver.observe(t, { childList: true, subtree: true });
    }
  }

  // ── postMessage plumbing ────────────────────────────────────────────────
  function postToParent(msg) {
    try { window.parent.postMessage(msg, '*'); } catch (e) { /* cross-origin */ }
  }

  function reply(rid, payload) {
    if (!rid) return;
    postToParent({ ...payload, _rid: rid });
  }

  function replyError(rid, type, error) {
    if (!rid) return;
    postToParent({ type, _rid: rid, _error: String(error?.message || error || 'unknown error') });
  }

  // ── Burg helpers ────────────────────────────────────────────────────────
  function burgToMsg(b) {
    return {
      id: b.i,
      name: b.name,
      cell: b.cell,
      x: b.x,
      y: b.y,
      population: (b.population || 0) * 1000,
      state: b.state,
      culture: b.culture,
      type: b.type,
      capital: b.capital,
      port: b.port,
      citadel: b.citadel,
      plaza: b.plaza,
      walls: b.walls,
      shanty: b.shanty,
      temple: b.temple,
      group: b.group,
      placed: true,
    };
  }

  function buildBurgList() {
    if (!pack?.burgs) return [];
    const placedSet = window.__sfPlacedBurgIds;
    return pack.burgs
      .filter((b, i) => i > 0 && !b.removed)
      .filter((b) => placedSet && placedSet.has(b.i))
      .map(burgToMsg);
  }

  function notifyBurgList() {
    postToParent({ type: 'fmg:burgList', burgs: buildBurgList() });
  }

  // ── Coordinate transform ────────────────────────────────────────────────
  // Convert a point from iframe screen-space into FMG map coordinates.
  // Returns null if the CTM isn't available yet (SVG not laid out).
  function screenToMap(x, y) {
    const svgEl = document.getElementById('map');
    if (!svgEl) return null;
    const vb = document.getElementById('viewbox');
    if (!vb) return null;
    const ctm = vb.getCTM();
    if (!ctm) return null;
    const inverse = ctm.inverse?.();
    if (!inverse) return null;
    const pt = svgEl.createSVGPoint();
    pt.x = x; pt.y = y;
    const out = pt.matrixTransform(inverse);
    return { x: out.x, y: out.y };
  }
  // Expose for the top-level drop handler (addDragToUpload IIFE) which is
  // outside this bridge closure and otherwise can't see local helpers.
  window.__sfScreenToMap = screenToMap;

  // ── Viewport broadcasting ───────────────────────────────────────────────
  // Parse a transform attribute of the form "translate(tx, ty) scale(k)" or
  // "matrix(a b c d e f)". Returns { tx, ty, scale } or null.
  function parseTransformAttr(attr) {
    if (!attr || typeof attr !== 'string') return null;
    const mMatrix = /matrix\(([^)]+)\)/.exec(attr);
    if (mMatrix) {
      const parts = mMatrix[1].split(/[\s,]+/).map(Number);
      if (parts.length >= 6 && parts.every(n => Number.isFinite(n))) {
        // matrix(a b c d e f) — a/d are scale, e/f are translate (no skew in d3 zoom)
        return { tx: parts[4], ty: parts[5], scale: parts[0] };
      }
    }
    const mTrans = /translate\(\s*([-0-9.eE]+)[\s,]+([-0-9.eE]+)\s*\)/.exec(attr);
    const mScale = /scale\(\s*([-0-9.eE]+)/.exec(attr);
    const tx = mTrans ? parseFloat(mTrans[1]) : 0;
    const ty = mTrans ? parseFloat(mTrans[2]) : 0;
    const scale = mScale ? parseFloat(mScale[1]) : 1;
    if (!Number.isFinite(tx) || !Number.isFinite(ty) || !Number.isFinite(scale)) return null;
    return { tx, ty, scale };
  }

  function getCurrentViewport() {
    try {
      // Prefer the actual DOM transform on #viewbox — that's what FMG renders
      // with, and it's always in sync with what the user sees. d3.zoomTransform
      // is a fallback for early-load before the attribute is written.
      let tx = 0, ty = 0, scale = 1;
      const vbEl = document.getElementById('viewbox');
      const parsed = vbEl ? parseTransformAttr(vbEl.getAttribute('transform')) : null;
      if (parsed) {
        tx = parsed.tx; ty = parsed.ty; scale = parsed.scale || 1;
      } else {
        const svgSel = window.svg;
        const tf = (svgSel && window.d3?.zoomTransform) ? window.d3.zoomTransform(svgSel.node()) : null;
        scale = tf?.k || 1;
        tx = tf?.x || 0;
        ty = tf?.y || 0;
      }
      const w = window.graphWidth || 0;
      const h = window.graphHeight || 0;
      const cx = (w / 2 - tx) / (scale || 1);
      const cy = (h / 2 - ty) / (scale || 1);
      return { cx, cy, scale, width: w, height: h, tx, ty };
    } catch (e) {
      return { cx: 0, cy: 0, scale: 1, width: 0, height: 0, tx: 0, ty: 0 };
    }
  }

  function scheduleViewportBroadcast() {
    if (viewportRafPending) return;
    viewportRafPending = true;
    requestAnimationFrame(() => {
      viewportRafPending = false;
      const vp = getCurrentViewport();
      if (lastViewportTx
          && lastViewportTx.cx === vp.cx
          && lastViewportTx.cy === vp.cy
          && lastViewportTx.scale === vp.scale) return;
      lastViewportTx = vp;
      postToParent({ type: 'fmg:viewport', ...vp });
    });
  }

  // The React overlay mirrors FMG's pan/zoom by applying the same d3 zoom
  // transform to its <g>. If the d3 `.on('zoom.sfBridge')` handler ever
  // misses a tick (e.g. zoom behavior reinstalled after a regenerate, or
  // transform mutated directly via `zoomTransform(...)`), icons and chain
  // lines drift relative to the geography. A RAF poll is a cheap safety
  // net — it reads the current CTM on every frame and only broadcasts
  // when something actually changed, so it's free during idle.
  let viewportRafHandle = 0;
  function viewportRafTick() {
    viewportRafHandle = 0;
    const vp = getCurrentViewport();
    if (!lastViewportTx
        || lastViewportTx.cx !== vp.cx
        || lastViewportTx.cy !== vp.cy
        || lastViewportTx.scale !== vp.scale
        || lastViewportTx.width !== vp.width
        || lastViewportTx.height !== vp.height) {
      lastViewportTx = vp;
      postToParent({ type: 'fmg:viewport', ...vp });
    }
    viewportRafHandle = requestAnimationFrame(viewportRafTick);
  }
  function installViewportBroadcaster() {
    try {
      if (window.zoom && window.svg) {
        window.zoom.on('zoom.sfBridge', scheduleViewportBroadcast);
      }
    } catch (e) { /* best-effort */ }
    // Start the RAF poll once (idempotent).
    if (!viewportRafHandle) {
      viewportRafHandle = requestAnimationFrame(viewportRafTick);
    }
  }

  // ── Burg editor hook (burgSelected push event) ──────────────────────────
  const origBurgEditorOpen = window.editBurg;
  if (typeof origBurgEditorOpen === 'function') {
    window.editBurg = function(id) {
      const b = pack?.burgs?.[id];
      if (b) postToParent({ type: 'fmg:burgSelected', burg: burgToMsg(b) });
      return origBurgEditorOpen.apply(this, arguments);
    };
  }

  // ── Snapshot save/load ──────────────────────────────────────────────────
  function saveSnapshotText() {
    if (typeof prepareMapData !== 'function') throw new Error('prepareMapData unavailable');
    return prepareMapData();
  }

  async function loadSnapshotText(snapshotText) {
    if (typeof uploadMap !== 'function') throw new Error('uploadMap unavailable');
    if (!snapshotText) throw new Error('empty snapshot');
    const blob = new Blob([snapshotText], { type: 'text/plain' });
    // uploadMap is the raw loader; skips the confirmation prompt that
    // loadMapPrompt shows.
    await uploadMap(blob);
    // Rebuild placement set from any data-sf-placed tags the snapshot
    // serialized. Callers can follow up with restorePlacements if needed.
    window.__sfPlacedBurgIds.clear();
    retagFromDOM();
  }

  function retagFromDOM() {
    document.querySelectorAll('#burgIcons circle[data-sf-placed]')
      .forEach(el => {
        const id = Number(el.getAttribute('data-id'));
        if (!Number.isNaN(id)) window.__sfPlacedBurgIds.add(id);
      });
  }

  async function resetMapCmd(seed) {
    if (typeof regenerateMap !== 'function') throw new Error('regenerateMap unavailable');
    if (seed != null) {
      try { window.seed = String(seed); } catch (e) {}
    }
    window.__sfPlacedBurgIds.clear();
    await Promise.resolve(regenerateMap('SettlementForge resetMap'));
  }

  // ── Command handlers ────────────────────────────────────────────────────
  const handlers = {
    'settlementEngine:requestBurgList'(data, rid) {
      const burgs = buildBurgList();
      reply(rid, { type: 'fmg:burgListReply', burgs });
      notifyBurgList();
    },

    'settlementEngine:placeSettlement'(data, rid) {
      // The placement icon is rendered by the React overlay (PlacementsLayer);
      // FMG's job here is just to convert screen→map coordinates and (best-effort)
      // resolve the underlying cellId for downstream geography lookups. We do
      // NOT call addBurg/drawBurgIcons/drawBurgLabels — those produced tiny
      // native burg circles that conflicted with our React-side icons.
      const { x, y, settlementId, name, population } = data;
      if (typeof x !== 'number' || typeof y !== 'number') {
        return replyError(rid, 'fmg:settlementPlacedReply', 'invalid coordinates');
      }
      const mapPt = screenToMap(x, y);
      if (!mapPt) {
        return replyError(rid, 'fmg:settlementPlacedReply', 'coordTransformFailed');
      }
      try {
        // Synthetic burg id — opaque key for placements map. Decoupled from
        // FMG's pack.burgs (which we no longer touch for placements).
        const burgId = `sf_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

        // Best-effort cell lookup for geography (terrain, biome, etc.).
        let cellId = null;
        try {
          if (typeof findCell === 'function') {
            cellId = findCell(mapPt.x, mapPt.y);
          } else if (pack?.cells?.q?.find) {
            cellId = pack.cells.q.find(mapPt.x, mapPt.y, Infinity);
          }
        } catch (_) { /* non-fatal */ }

        const result = {
          burgId,
          settlementId: settlementId || null,
          name: name || '',
          population: population || 0,
          x: mapPt.x,
          y: mapPt.y,
          cellId,
        };
        reply(rid, { type: 'fmg:settlementPlacedReply', ...result });
        postToParent({ type: 'fmg:settlementPlaced', ...result });
      } catch (err) {
        console.warn('[sfBridge] placeSettlement failed', err);
        replyError(rid, 'fmg:settlementPlacedReply', err);
      }
    },

    'settlementEngine:removePlacement'(data, rid) {
      // Placements are React-state-owned. FMG no longer needs to do anything.
      // The store's removePlacementLocal action handles the actual removal;
      // this handler exists for protocol symmetry and to clean up any legacy
      // numeric-id burg that may still exist from older snapshots.
      const { burgId } = data;
      try {
        if (typeof burgId === 'number' && pack?.burgs?.[burgId]) {
          pack.burgs[burgId].removed = true;
          if (typeof drawBurgIcons === 'function') drawBurgIcons();
          if (typeof drawBurgLabels === 'function') drawBurgLabels();
        }
        if (window.__sfPlacedBurgIds) window.__sfPlacedBurgIds.delete(burgId);
        reply(rid, { type: 'fmg:placementRemovedReply', burgId });
        postToParent({ type: 'fmg:placementRemoved', burgId });
      } catch (err) {
        replyError(rid, 'fmg:placementRemovedReply', err);
      }
    },

    'settlementEngine:clearAllPlacements'(data, rid) {
      // Same story: state cleared on the React side. Best-effort cleanup of
      // any legacy native burgs from older snapshots.
      try {
        if (pack?.burgs && window.__sfPlacedBurgIds) {
          for (const id of window.__sfPlacedBurgIds) {
            if (typeof id === 'number' && pack.burgs[id]) pack.burgs[id].removed = true;
          }
          if (typeof drawBurgIcons === 'function') drawBurgIcons();
          if (typeof drawBurgLabels === 'function') drawBurgLabels();
        }
        if (window.__sfPlacedBurgIds) window.__sfPlacedBurgIds.clear();
        reply(rid, { type: 'fmg:allPlacementsClearedReply' });
        postToParent({ type: 'fmg:allPlacementsCleared' });
      } catch (err) {
        replyError(rid, 'fmg:allPlacementsClearedReply', err);
      }
    },

    'settlementEngine:restorePlacements'(data, rid) {
      // No-op on the FMG side now that placements are React-rendered. The
      // store hydrates `mapState.placements` from the campaign snapshot
      // independently; this handler stays for protocol compatibility.
      const { placements } = data;
      if (!Array.isArray(placements)) {
        return replyError(rid, 'fmg:placementsRestoredReply', 'placements array required');
      }
      const restored = placements
        .filter(p => typeof p.x === 'number' && typeof p.y === 'number')
        .map(p => ({
          burgId: p.burgId || `sf_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
          settlementId: p.settlementId || null,
          name: p.name || '',
          x: p.x,
          y: p.y,
          cellId: p.cellId ?? null,
        }));
      reply(rid, { type: 'fmg:placementsRestoredReply', restored });
      postToParent({ type: 'fmg:placementsRestored', restored });
    },

    // ── Road network (A* over pack.cells, land + sea) ─────────────────────
    // Input:  { edges: [{id, fromX, fromY, toX, toY, preferSea}] }
    // Output: { paths: { [id]: { points: [{x,y},...], mode: 'land'|'sea' } } }
    //
    // Cost function is biome- and elevation-aware:
    //   - ocean cells (h < 20): impassable in land mode, cheap in sea mode
    //   - mountains (h > 60): expensive
    //   - forests/taiga/rainforest: moderately expensive
    //   - plains/grassland/savanna: cheap
    //   - rivers add a small crossing penalty
    // Edges are routed independently; each path is a polyline of cell centers
    // in FMG map coordinates. Overlay <g> applies the same transform FMG uses,
    // so these render aligned with the geography.
    'settlementEngine:computeRoadNetwork'(data, rid) {
      try {
        const { edges } = data || {};
        if (!Array.isArray(edges) || !edges.length || !pack?.cells?.c) {
          return reply(rid, { type: 'fmg:roadNetworkReply', paths: {} });
        }

        const cells = pack.cells;
        const H = cells.h || [];
        const B = cells.biome || [];
        const R = cells.r || [];
        const P = cells.p || [];
        const C = cells.c || [];

        const isLand   = (i) => (H[i] || 0) >= 20;
        const isOcean  = (i) => (H[i] || 0) <  20;

        // Biome costs keyed by FMG biome id. Missing biomes fall back to 2.
        // (FMG biome ids: 0 marine, 1 hot desert, 2 cold desert, 3 savanna,
        //  4 grassland, 5 tropical seasonal, 6 temperate deciduous,
        //  7 tropical rainforest, 8 temperate rainforest, 9 taiga,
        //  10 tundra, 11 glacier, 12 wetland)
        const BIOME_COST = [
          99,    // marine (won't be hit in land mode; guarded by isLand)
          1.8,   // hot desert
          1.6,   // cold desert
          1.0,   // savanna
          0.9,   // grassland
          1.6,   // tropical seasonal forest
          1.9,   // temperate deciduous forest
          2.6,   // tropical rainforest
          2.2,   // temperate rainforest
          2.2,   // taiga
          1.5,   // tundra
          4.0,   // glacier
          1.9,   // wetland
        ];

        const landCost = (cell) => {
          if (!isLand(cell)) return Infinity;
          const h = H[cell] || 0;
          const b = B[cell] ?? 4;
          const base = BIOME_COST[b] ?? 2.0;
          // Mountain penalty kicks in steeply above h=60 (FMG uses 0..100).
          const elevMult = h > 60 ? 1 + (h - 60) / 15 : 1;
          const riverBias = R[cell] ? 0.3 : 0;
          return base * elevMult + riverBias;
        };

        const seaCost = (cell) => {
          if (!isOcean(cell)) return Infinity;
          // Shallow/coastal ocean (h 10–20) is slightly more expensive than
          // deep water — hugs the coast for short hops, opens up for long ones.
          const h = H[cell] || 0;
          return h >= 15 ? 1.2 : 0.9;
        };

        // Pack has `findCell(x, y)` as a global. Fall back to a linear scan
        // only if it's not available — linear scan is O(n) which is fine for
        // the handful of endpoints we need per request.
        const findCellAt = (x, y) => {
          try {
            if (typeof findCell === 'function') {
              const c = findCell(x, y);
              if (c != null && c >= 0) return c;
            }
          } catch (_) {}
          let best = -1, bd = Infinity;
          const n = cells.i?.length || P.length;
          for (let i = 0; i < n; i++) {
            const p = P[i];
            if (!p) continue;
            const d = (p[0] - x) ** 2 + (p[1] - y) ** 2;
            if (d < bd) { bd = d; best = i; }
          }
          return best;
        };

        // A* over the pack-cell adjacency graph.
        // cells.c[i] is the neighbour index list for cell i.
        const MAX_ITER = 25000;
        const aStar = (startCell, goalCell, costFn) => {
          if (startCell == null || goalCell == null) return null;
          if (startCell < 0 || goalCell < 0) return null;
          if (startCell === goalCell) return [{ x: P[startCell][0], y: P[startCell][1] }];

          const goalP = P[goalCell];
          const heuristic = (c) => {
            const p = P[c];
            if (!p) return Infinity;
            return Math.hypot(p[0] - goalP[0], p[1] - goalP[1]);
          };

          const gScore = new Map();
          const came   = new Map();
          gScore.set(startCell, 0);

          // Simple open list as sorted array — fine for paths up to a few
          // thousand cells. Replace with a binary heap if this becomes hot.
          const open = [{ c: startCell, f: heuristic(startCell) }];
          const inOpen = new Set([startCell]);

          let iter = 0;
          while (open.length && iter++ < MAX_ITER) {
            // Pop lowest-f (linear scan is faster than re-sorting on push)
            let bestIdx = 0;
            for (let i = 1; i < open.length; i++) {
              if (open[i].f < open[bestIdx].f) bestIdx = i;
            }
            const { c: current } = open.splice(bestIdx, 1)[0];
            inOpen.delete(current);

            if (current === goalCell) {
              const path = [];
              let cur = current;
              path.push({ x: P[cur][0], y: P[cur][1] });
              while (came.has(cur)) {
                cur = came.get(cur);
                path.unshift({ x: P[cur][0], y: P[cur][1] });
              }
              return path;
            }

            const neighbours = C[current] || [];
            const curP = P[current];
            const gCur = gScore.get(current) ?? Infinity;

            for (let k = 0; k < neighbours.length; k++) {
              const n = neighbours[k];
              const nc = costFn(n);
              if (!isFinite(nc)) continue;
              const nP = P[n];
              if (!nP) continue;
              const edgeDist = Math.hypot(nP[0] - curP[0], nP[1] - curP[1]);
              const tentativeG = gCur + nc * edgeDist;
              if (tentativeG < (gScore.get(n) ?? Infinity)) {
                came.set(n, current);
                gScore.set(n, tentativeG);
                const f = tentativeG + heuristic(n);
                if (!inOpen.has(n)) {
                  open.push({ c: n, f });
                  inOpen.add(n);
                }
              }
            }
          }
          return null;
        };

        // Find the nearest ocean cell to a coastal land cell (BFS outward).
        const findNearestOcean = (cell) => {
          if (isOcean(cell)) return cell;
          const q = [cell];
          const seen = new Set([cell]);
          let guard = 0;
          while (q.length && guard++ < 400) {
            const cur = q.shift();
            for (const n of (C[cur] || [])) {
              if (seen.has(n)) continue;
              seen.add(n);
              if (isOcean(n)) return n;
              q.push(n);
            }
          }
          return null;
        };

        const isCoastal = (cell) => {
          if (!isLand(cell)) return false;
          const nb = C[cell] || [];
          for (const n of nb) { if (isOcean(n)) return true; }
          return false;
        };

        const paths = {};
        for (const e of edges) {
          const startC = findCellAt(e.fromX, e.fromY);
          const goalC  = findCellAt(e.toX,   e.toY);
          if (startC < 0 || goalC < 0) continue;

          let landPath = null;
          if (isLand(startC) && isLand(goalC)) {
            landPath = aStar(startC, goalC, landCost);
          }

          let seaPath = null;
          const canSea = (e.preferSea || !landPath) && isCoastal(startC) && isCoastal(goalC);
          if (canSea) {
            const seaStart = findNearestOcean(startC);
            const seaGoal  = findNearestOcean(goalC);
            if (seaStart != null && seaGoal != null) {
              const mid = aStar(seaStart, seaGoal, seaCost);
              if (mid && mid.length >= 2) {
                seaPath = [
                  { x: P[startC][0], y: P[startC][1] },
                  ...mid,
                  { x: P[goalC][0], y: P[goalC][1] },
                ];
              }
            }
          }

          // Pick the cheaper-ish option. We don't have true costs here, so use
          // polyline length as a proxy. Sea only wins if clearly shorter, since
          // land paths are usually preferred for adjacent settlements.
          const plen = (pts) => {
            if (!pts) return Infinity;
            let t = 0;
            for (let i = 1; i < pts.length; i++) {
              t += Math.hypot(pts[i].x - pts[i-1].x, pts[i].y - pts[i-1].y);
            }
            return t;
          };

          let chosen = null, mode = 'land';
          if (landPath && seaPath) {
            chosen = plen(seaPath) * 1.15 < plen(landPath) ? seaPath : landPath;
            mode = chosen === seaPath ? 'sea' : 'land';
          } else if (landPath) {
            chosen = landPath; mode = 'land';
          } else if (seaPath) {
            chosen = seaPath; mode = 'sea';
          }

          if (chosen && chosen.length >= 2) {
            paths[e.id] = { points: chosen, mode };
          }
        }

        reply(rid, { type: 'fmg:roadNetworkReply', paths });
      } catch (err) {
        console.warn('[sfBridge] computeRoadNetwork failed', err);
        replyError(rid, 'fmg:roadNetworkReply', err);
      }
    },

    'settlementEngine:getViewport'(data, rid) {
      reply(rid, { type: 'fmg:viewportReply', ...getCurrentViewport() });
    },

    'settlementEngine:setViewport'(data, rid) {
      const { cx, cy, scale, duration = 600 } = data;
      try {
        if (typeof window.zoomTo === 'function' && cx != null && cy != null) {
          window.zoomTo(cx, cy, scale || 3, duration);
        } else if (window.zoom && window.svg && window.d3) {
          const w = window.graphWidth || 0;
          const h = window.graphHeight || 0;
          const s = scale || 1;
          const tx = w / 2 - cx * s;
          const ty = h / 2 - cy * s;
          window.svg.transition().duration(duration)
            .call(window.zoom.transform, window.d3.zoomIdentity.translate(tx, ty).scale(s));
        }
        // The zoom event will fire and broadcast a new viewport; also reply
        // synchronously with the pre-transition state for the caller.
        reply(rid, { type: 'fmg:viewportReply', ...getCurrentViewport() });
      } catch (err) {
        replyError(rid, 'fmg:viewportReply', err);
      }
    },

    'settlementEngine:fitMap'(data, rid) {
      try {
        if (window.zoom && window.svg && window.d3) {
          window.svg.transition().duration(600)
            .call(window.zoom.transform, window.d3.zoomIdentity);
        }
        reply(rid, { type: 'fmg:viewportReply', ...getCurrentViewport() });
      } catch (err) {
        replyError(rid, 'fmg:viewportReply', err);
      }
    },

    'settlementEngine:saveSnapshot'(data, rid) {
      try {
        const snapshot = saveSnapshotText();
        reply(rid, { type: 'fmg:snapshotReply', snapshot });
      } catch (err) {
        replyError(rid, 'fmg:snapshotReply', err);
      }
    },

    async 'settlementEngine:loadSnapshot'(data, rid) {
      try {
        await loadSnapshotText(data.snapshot);
        // Let FMG settle, then reinstall observers (SVG nodes got replaced)
        setTimeout(() => {
          installMutationObservers();
          installViewportBroadcaster();
          scheduleViewportBroadcast();
          reply(rid, { type: 'fmg:snapshotLoadedReply' });
          postToParent({ type: 'fmg:snapshotLoaded' });
          notifyBurgList();
        }, 300);
      } catch (err) {
        replyError(rid, 'fmg:snapshotLoadedReply', err);
      }
    },

    async 'settlementEngine:resetMap'(data, rid) {
      try {
        await resetMapCmd(data.seed);
        setTimeout(() => {
          installMutationObservers();
          installViewportBroadcaster();
          scheduleViewportBroadcast();
          reply(rid, { type: 'fmg:mapResetReply', seed: pack?.seed || null });
          postToParent({ type: 'fmg:mapReset', seed: pack?.seed || null });
          notifyBurgList();
        }, 500);
      } catch (err) {
        replyError(rid, 'fmg:mapResetReply', err);
      }
    },

    'settlementEngine:activateTool'(data, rid) {
      const { tool } = data;
      // FMG's internal editor functions assume the user clicked a DOM button and
      // often call `event.target.getAttribute(...)` or reach into state that
      // may not be initialized. Wrap each attempt individually so one tool's
      // internal null-ref doesn't look like a bridge failure.
      const tryCall = (fn, label) => {
        if (typeof fn !== 'function') return false;
        try { fn(); return true; }
        catch (err) {
          console.warn(`[sfBridge] activateTool(${label}) threw:`, err && err.message || err);
          return false;
        }
      };
      try {
        let activated = false;
        switch (tool) {
          case 'heightmap':
            activated = tryCall(window.editHeightmap, 'editHeightmap')
                     || tryCall(() => window.openEditor && window.openEditor('heightmap'), 'openEditor(heightmap)');
            break;
          case 'rivers':
            activated = tryCall(window.editRiver, 'editRiver')
                     || tryCall(window.toggleRivers, 'toggleRivers');
            break;
          case 'coastline':
            activated = tryCall(window.editCoastline, 'editCoastline');
            break;
          case 'lakes':
            activated = tryCall(window.editLake, 'editLake');
            break;
          case 'biomes':
            activated = tryCall(window.editBiomes, 'editBiomes')
                     || tryCall(() => window.openEditor && window.openEditor('biomes'), 'openEditor(biomes)');
            break;
          default:
            return replyError(rid, 'fmg:toolActivatedReply', `unknown tool: ${tool}`);
        }
        reply(rid, { type: 'fmg:toolActivatedReply', tool, activated });
        if (activated) postToParent({ type: 'fmg:terrainChanged', tool });
      } catch (err) {
        replyError(rid, 'fmg:toolActivatedReply', err);
      }
    },

    'settlementEngine:deactivateTool'(data, rid) {
      try {
        // Best-effort: close any open jQuery UI dialog (FMG editors use these).
        try {
          const dialogs = document.querySelectorAll('.ui-dialog-content');
          dialogs.forEach(d => {
            try { if (window.$ && window.$(d).dialog) window.$(d).dialog('close'); } catch (e) {}
          });
        } catch (e) {}
        reply(rid, { type: 'fmg:toolDeactivatedReply' });
      } catch (err) {
        replyError(rid, 'fmg:toolDeactivatedReply', err);
      }
    },

    'settlementEngine:terrainUndo'(data, rid) {
      try {
        if (window.HeightmapEditor?.undo) window.HeightmapEditor.undo();
        reply(rid, { type: 'fmg:terrainUndoReply' });
      } catch (err) {
        replyError(rid, 'fmg:terrainUndoReply', err);
      }
    },

    'settlementEngine:terrainRedo'(data, rid) {
      try {
        if (window.HeightmapEditor?.redo) window.HeightmapEditor.redo();
        reply(rid, { type: 'fmg:terrainRedoReply' });
      } catch (err) {
        replyError(rid, 'fmg:terrainRedoReply', err);
      }
    },

    'settlementEngine:setEmbeddedMode'(data, rid) {
      try {
        if (data.enabled) document.body.classList.add('sf-embedded');
        else document.body.classList.remove('sf-embedded');
        reply(rid, { type: 'fmg:embeddedModeReply', enabled: !!data.enabled });
      } catch (err) {
        replyError(rid, 'fmg:embeddedModeReply', err);
      }
    },

    // Show/hide a native FMG layer (states, cultures, biomes, etc.) by
    // toggling the corresponding SVG <g> element's display. We avoid calling
    // FMG's toggle* helpers in general because many run drawing side effects
    // we don't want — but biomes is a special case: its <g> is *empty* until
    // drawBiomes() populates it, so the first show-request needs to invoke
    // the draw call once. After that, plain display flipping is enough.
    'settlementEngine:setFmgLayer'(data, rid) {
      try {
        const { layer, visible } = data || {};
        // Map our layer keys to the actual FMG DOM layer ids.
        const LAYER_MAP = {
          stateBorders:   ['stateBorders', 'regions'],
          cultures:       ['cults', 'cultures'],
          biomes:         ['biomes'],
          routes:         ['routes'],
          rivers:         ['rivers'],
        };
        const ids = LAYER_MAP[layer];
        if (!ids) {
          return replyError(rid, 'fmg:setFmgLayerReply',
            `unknown layer: ${layer}. Valid: ${Object.keys(LAYER_MAP).join(', ')}`);
        }

        // Lazy-populate biomes on first show so the layer actually has
        // something to display when we flip the style.
        if (layer === 'biomes' && visible) {
          const g = document.getElementById('biomes');
          const empty = !g || g.querySelector('path') == null;
          if (empty && typeof window.drawBiomes === 'function') {
            try { window.drawBiomes(); } catch (e) { console.warn('[bridge] drawBiomes failed', e); }
          }
        }

        const applied = [];
        for (const id of ids) {
          const el = document.getElementById(id);
          if (!el) continue;
          el.style.display = visible ? 'inline' : 'none';
          applied.push(id);
        }
        reply(rid, { type: 'fmg:setFmgLayerReply', layer, visible: !!visible, applied });
      } catch (err) {
        replyError(rid, 'fmg:setFmgLayerReply', err);
      }
    },

    // Set the heightmap template for the NEXT regeneration.
    // templateId must be a key from SF_TEMPLATES (e.g. 'highIsland', 'sfArchipelago').
    'settlementEngine:setTemplate'(data, rid) {
      const { templateId } = data;
      if (!SF_TEMPLATES[templateId]) {
        return replyError(rid, 'fmg:setTemplateReply',
          `unknown template: ${templateId}. Valid: ${Object.keys(SF_TEMPLATES).join(', ')}`);
      }
      window.__sfRequestedTemplate = templateId;
      reply(rid, { type: 'fmg:setTemplateReply', templateId });
    },

    // Get available templates
    'settlementEngine:getTemplates'(data, rid) {
      reply(rid, {
        type: 'fmg:getTemplatesReply',
        templates: Object.entries(SF_TEMPLATES).map(([id, t]) => ({ id, label: t.label })),
        current: window.__sfRequestedTemplate || null,
      });
    },
  };

  // ── Message listener ────────────────────────────────────────────────────
  window.addEventListener('message', async (event) => {
    const data = event?.data;
    if (!data || typeof data !== 'object') return;
    const { type, _rid } = data;
    if (typeof type !== 'string' || !type.startsWith('settlementEngine:')) return;

    const handler = handlers[type];
    if (!handler) return;  // unknown command — silent

    try {
      await handler(data, _rid);
    } catch (err) {
      console.warn('[sfBridge] handler threw', type, err);
      const replyType = type.replace(/^settlementEngine:/, 'fmg:') + 'Reply';
      replyError(_rid, replyType, err);
    }
  });

  // ── Ready sequence ──────────────────────────────────────────────────────
  function notifyReady() {
    if (readyNotified) return;
    readyNotified = true;
    const seed = pack?.seed || null;
    postToParent({
      type: 'fmg:ready',
      seed,
      width: window.graphWidth || 0,
      height: window.graphHeight || 0,
      templates: Object.entries(SF_TEMPLATES).map(([id, t]) => ({ id, label: t.label })),
    });
    notifyBurgList();

    // Install post-ready hooks
    installMutationObservers();
    installViewportBroadcaster();
    scheduleViewportBroadcast();

    // Fit the map to show the full landmass (no state-based zoom — we have
    // no states in embedded mode). Uses FMG's built-in fitMapToScreen.
    try {
      if (typeof fitMapToScreen === 'function') fitMapToScreen();
    } catch (e) { /* best-effort */ }
  }

  // Ready poll: check for pack.cells (geography is done) instead of
  // pack.burgs (which may be empty when manors=0).
  const readyPoll = setInterval(() => {
    const hasCells = pack?.cells?.i?.length > 0;
    const hasBurgs = pack?.burgs?.length > 0;
    if (hasCells || hasBurgs) {
      clearInterval(readyPoll);
      notifyReady();
    }
  }, 500);

  // Re-notify on map regeneration
  const origGenerate = window.regenerateMap;
  if (typeof origGenerate === 'function') {
    window.regenerateMap = function() {
      readyNotified = false;
      // Re-scale canvas to current viewport before regenerating
      scaleCanvasToViewport();
      const result = origGenerate.apply(this, arguments);
      setTimeout(() => notifyReady(), 2000);
      return result;
    };
  }
})();
