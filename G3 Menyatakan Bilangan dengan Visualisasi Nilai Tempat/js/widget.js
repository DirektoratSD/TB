// --- State ---

const countObject = {
    unit: 0,
    ten: 0,
    hundred: 0,
  },
  plusBtnObject = {
    unit: unitsPlus,
    ten: tensPlus,
    hundred: hPlus,
  },
  minusBtnObject = {
    unit: unitsMinus,
    ten: tensMinus,
    hundred: hMinus,
  },
  squareContainerObject = {
    unit: unitSquaresContainer,
    ten: tenSquaresContainer,
    hundred: hSquaresContainer,
  },
  leftDirObject = {
    unit: unitLeftDir,
    ten: tenLeftDir,
    hundred: hLeftDir,
  },
  dataForAnimationObject = {
    unit: {
      next: "ten",
      nextDirection: "column",
    },
    ten: {
      next: "hundred",
      nextDirection: "row",
    },
    hundred: {
      next: null,
      nextDirection: null,
    },
  };

let isNumberTextUp = false;

function addBlock(tag, visible = true) {
  const block = document.createElement("img");
  block.src = `assets/${tag}.png`;
  const container = document.querySelector(`#${tag}-widget .squares-container`);
  container.appendChild(block);
  const visibility = visible ? "visible" : "hidden";
  block.style.visibility = visibility;
  return block;
}
function removeBlock(tag) {
  const container = document.querySelector(`#${tag}-widget .squares-container`);
  container.lastElementChild.remove();
}
function addBlocksMultiple(tag, n, visibile = true) {
  for (let i = 0; i < n; i++) {
    addBlock(tag, visibile);
  }
}
function removeBlockMultiple(tag, n) {
  for (let i = 0; i < n; i++) {
    removeBlock(tag);
  }
}
function updateNumberTab(tag, n) {
  const numberTab = document.querySelector(`#${tag}-widget .number-tab`);
  numberTab.textContent = n < 10 ? n : "X";
}
function updateTextDisplay(tag, n) {
  const textDisplay = document.querySelector(`#${tag}-widget .text-display`);
  textDisplay.textContent = n + (n === 1 ? tags.one : tags.ones);
}
function returnEventListenerForPlusBtn(tag) {
  return () => {
    if (countObject[tag] < 10) {
      playSound("click");
      showStatement(-1);
      turnOffGlow();
      addBlock(tag);
      countObject[tag]++;
      updateNumberTab(tag, countObject[tag]);
    }
    if (countObject[tag] === 10) {
      wiggle(tag, true);
    }
  };
}
function returnEventListenerForMinusBtn(tag) {
  return () => {
    if (countObject[tag] > 0) {
      showStatement(-1);
      turnOffGlow();
      wiggle(tag, false);
      playSound("click");
      removeBlock(tag);
      countObject[tag]--;
      updateNumberTab(tag, countObject[tag]);
    }
  };
}

Object.entries(plusBtnObject).forEach(([tag, btn]) => {
  btn.addEventListener("click", returnEventListenerForPlusBtn(tag));
});
Object.entries(minusBtnObject).forEach(([tag, btn]) => {
  btn.addEventListener("click", returnEventListenerForMinusBtn(tag));
});

function resetContainers() {
  Object.keys(countObject).forEach((key) => (countObject[key] = 0));
  Object.values(squareContainerObject).forEach(
    (container) => (container.innerHTML = "")
  );
  document
    .querySelectorAll(".number-tab")
    .forEach((tab) => (tab.textContent = 0));
}
resetContainers();
function createAndPositionStack(targetElement, direction) {
  const container = document.createElement("div");
  container.id = "stack-container";
  container.style.position = "absolute";

  const offsetTop = targetElement.offsetTop;
  const offsetLeft = targetElement.offsetLeft;
  const width = targetElement.offsetWidth;
  const height = targetElement.offsetHeight;

  container.style.top = `${offsetTop}px`;
  container.style.left = `${offsetLeft}px`;
  container.style.width = `${width}px`;
  container.style.height = `${height}px`;
  container.style.display = "flex";
  container.style.flexDirection = direction;

  for (let i = 0; i < 10; i++) {
    const rod = document.createElement("div");
    rod.className = "block-in-stack";
    container.appendChild(rod);
  }

  // 🔁 Append to the nearest positioned parent
  const parent = targetElement.offsetParent || document.body;
  parent.appendChild(container);
  return container;
}

function animateCloneToTarget(
  sourceElement,
  targetElement,
  onStart,
  onComplete,
  targetRectProp = {}
) {
  const targetRect = targetElement.getBoundingClientRect();
  const clone = createClone(sourceElement);
  onStart?.();
  const newTargetRect = { ...targetRect, ...targetRectProp };
  animateClone(clone, targetRect, onComplete);
}
function promiseWrapper(func, sourceEl, targetEl, onStart, onEnd) {
  return new Promise((resolve) => {
    func(
      sourceEl,
      targetEl,
      () => {
        onStart?.();
      },
      () => {
        onEnd?.();
        resolve();
      }
    );
  });
}
function createClone(sourceElement) {
  const clone = sourceElement.cloneNode(true);
  const styles = window.getComputedStyle(sourceElement);
  clone.id = "";
  const sourceRect = sourceElement.getBoundingClientRect();
  clone.style.position = "absolute";
  clone.style.margin = "0"; // Reset margins
  clone.style.boxSizing = "border-box"; // Consistent box model
  clone.style.zIndex = "50"; // Ensure it's on top during animation
  clone.style.backgroundColor = styles.backgroundColor;
  // Set initial size and position (relative to the document)
  clone.style.width = `${sourceRect.width}px`;
  clone.style.height = `${sourceRect.height}px`;
  clone.style.top = `${sourceRect.top + window.scrollY}px`;
  clone.style.left = `${sourceRect.left + window.scrollX}px`;
  clone.style.transitionProperty = "top, left, width, height";
  clone.style.transitionDuration = `500ms`;
  clone.style.transitionTimingFunction = "ease-in-out";
  document.body.appendChild(clone);
  return clone;
}

function animateClone(clone, targetRect, onComplete) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      clone.style.top = `${targetRect.top + window.scrollY}px`;
      clone.style.left = `${targetRect.left + window.scrollX}px`;
      clone.style.width = `${targetRect.width}px`;
      clone.style.height = `${targetRect.height}px`;
    });
  });

  // Clean up after the animation
  clone.addEventListener(
    "transitionend",
    function handleTransitionEnd() {
      clone.removeEventListener("transitionend", handleTransitionEnd);
      clone.parentNode.removeChild(clone);
      onComplete?.();
    },
    { once: true }
  );
}
async function animateOverflow(tag) {
  const nextTag = dataForAnimationObject[tag].next;
  if (!nextTag) return;
  const dir = dataForAnimationObject[tag].nextDirection;
  let source = squareContainerObject[tag];
  let fromBlocks = source.querySelectorAll("img");
  fromBlocks = Array.from(fromBlocks);
  addBlock(nextTag, false);
  const stackedClone = createAndPositionStack(
    squareContainerObject[nextTag].lastElementChild,
    dir
  );
  const toBlocks = stackedClone.querySelectorAll("div");
  const promisesList = fromBlocks.map((src, index) => {
    const dest = toBlocks[index];
    return promiseWrapper(
      animateCloneToTarget,
      src,
      dest,
      () => {
        src.style.visibility = "hidden";
      },
      () => {
        //placeholder
      }
    );
  });
  return Promise.all(promisesList);
}
async function animateOverflowWrapper(tag) {
  const nextTag = dataForAnimationObject[tag].next;
  if (countObject[tag] < 10 || !nextTag) return;
  updateNumberTab(tag, 0);
  await animateOverflow(tag);
  document.getElementById("stack-container").remove();
  squareContainerObject[nextTag].lastElementChild.style.visibility = "visible";
  updateNumberTab(nextTag, 1);
  countObject[tag] = 0;
  countObject[nextTag] = 1;
  removeBlockMultiple(tag, 10);
}
function handleLeftDir(tag) {
  return async () => {
    const nextTag = dataForAnimationObject[tag].next;
    if (countObject[tag] < 10 || !nextTag) return;
    leftDirObject[tag].style.display = "none";
    showControlButtons(nextTag, true);
    playSound("click");
    wiggle(tag, false);
    await animateOverflowWrapper(tag);
  };
}
Object.entries(leftDirObject).forEach(([tag, dir]) =>
  dir.addEventListener("click", handleLeftDir(tag))
);