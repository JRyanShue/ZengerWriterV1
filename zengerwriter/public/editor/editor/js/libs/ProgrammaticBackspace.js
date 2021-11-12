
function addProgrammaticBackspace( dom ) {

    dom.addEventListener('keydown', (e) => {

        if (e.key == "Backspace") {

            if (dom.selectionStart == dom.selectionEnd && dom.selectionStart != 0) {

                let oldSelectionStart = dom.selectionStart;
                dom.value = dom.value.slice(0, dom.selectionStart - 1) + dom.value.slice(dom.selectionStart, dom.value.length);
                dom.selectionStart, dom.selectionEnd = oldSelectionStart-1;

            }
            else if (dom.selectionStart != dom.selectionEnd) {

                let oldSelectionStart = dom.selectionStart;
                dom.value = dom.value.slice(0, dom.selectionStart) + dom.value.slice(dom.selectionEnd, dom.value.length);
                
                if (dom.selectionStart != 0) {

                    dom.selectionStart, dom.selectionEnd = oldSelectionStart;

                }
                else {

                    dom.selectionStart, dom.selectionEnd = 0;

                }

            }

        }

    });

}

export { addProgrammaticBackspace }
