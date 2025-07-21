let fakeCursor = null;
let lastTarget = null;
let clickHandler = null;

function createFakeCursor(x, y) {
    removeFakeCursor();
    fakeCursor = document.createElement('div');
    fakeCursor.style.position = 'fixed';
    fakeCursor.style.left = x + 'px';
    fakeCursor.style.top = y + 'px';
    fakeCursor.style.width = '32px';
    fakeCursor.style.height = '32px';
    fakeCursor.style.border = '3.3px solid #a764ec';
    fakeCursor.style.background = 'rgba(255,255,255,0.97)';
    fakeCursor.style.borderRadius = '50%';
    fakeCursor.style.zIndex = '99999';
    fakeCursor.style.boxShadow = '0 2px 8px #a764ec33';
    fakeCursor.style.pointerEvents = 'none';
    fakeCursor.style.display = 'flex';
    fakeCursor.style.alignItems = 'center';
    fakeCursor.style.justifyContent = 'center';
    fakeCursor.style.transition = 'left 0.4s, top 0.4s';
    fakeCursor.innerHTML = `<div style="width: 8px; height: 8px; background: #a764ec; border-radius: 50%;"></div>`;
    document.body.appendChild(fakeCursor);
}
function moveFakeCursorToElement(element) {
    const rect = element.getBoundingClientRect();
    // Center the fake cursor
    const x = rect.left + rect.width / 2 - 16;
    const y = rect.top + rect.height / 2 - 16;
    createFakeCursor(x, y);
}

function removeFakeCursor() {
    if (fakeCursor && fakeCursor.parentNode) {
        fakeCursor.parentNode.removeChild(fakeCursor);
        fakeCursor = null;
    }
    if (lastTarget && clickHandler) {
        lastTarget.removeEventListener('click', clickHandler, true);
        clickHandler = null;
        lastTarget = null;
    }
}

window.addOnSandboxSdk?.instance?.runtime.on?.("showPointer", data => {
    removeFakeCursor();
    if (!data.selector) return;

    let tries = 0;
    function attempt() {
        const target = document.querySelector(data.selector);
        if (!target && tries < 6) {
            tries++;
            setTimeout(attempt, 400);
            return;
        }
        if (!target) return;

        lastTarget = target;
        moveFakeCursorToElement(target);

        clickHandler = () => {
            removeFakeCursor();
        };
        target.addEventListener('click', clickHandler, true);
    }
    attempt();
});

window.addOnSandboxSdk?.instance?.runtime.on?.("hidePointer", () => {
    removeFakeCursor();
});
