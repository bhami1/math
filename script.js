"use strict";

// Get HTML elements
const textInput = document.getElementById("textInput");
const wordInput = document.getElementById("wordInput");
const replaceInput = document.getElementById("replaceInput");
const startIndex = document.getElementById("startIndex");
const endIndex = document.getElementById("endIndex");

const numberInput = document.getElementById("numberInput");
const secondNumber = document.getElementById("secondNumber");
const minRandom = document.getElementById("minRandom");
const maxRandom = document.getElementById("maxRandom");

const stringResult = document.getElementById("stringResult");
const mathResult = document.getElementById("mathResult");

// Display results safely as text
function showStringResult(message) {
    stringResult.textContent = message;
}

function showMathResult(message) {
    mathResult.textContent = message;
}

// Validate numeric inputs
function getNumber(element, name) {
    if (element.value.trim() === "") {
        throw new Error(`Please enter ${name}.`);
    }

    const value = Number(element.value);

    if (!Number.isFinite(value)) {
        throw new Error(`${name} must be a valid finite number.`);
    }

    return value;
}

// Get the string and word values
function getText() {
    return textInput.value;
}

function getWord() {
    const word = wordInput.value;

    if (word === "") {
        throw new Error("Please enter a word to find.");
    }

    return word;
}

// ------------------------------------
// STRING FUNCTIONS
// ------------------------------------

function performStringOperation(operation) {
    const text = getText();
    const word = wordInput.value;
    const replacement = replaceInput.value;

    const start = getNumber(startIndex, "the start index");
    const end = getNumber(endIndex, "the end index or length");

    let result;

    try {
        switch (operation) {
            // Find the length
            case "length":
                result = `String length: ${text.length}`;
                break;

            // Find the first occurrence
            case "first": {
                const target = getWord();
                const index = text.indexOf(target);

                result = index === -1
                    ? `"${target}" was not found.`
                    : `First occurrence of "${target}" is at index ${index}.`;
                break;
            }

            // Find the last occurrence
            case "last": {
                const target = getWord();
                const index = text.lastIndexOf(target);

                result = index === -1
                    ? `"${target}" was not found.`
                    : `Last occurrence of "${target}" is at index ${index}.`;
                break;
            }

            // Search for a word
            case "search": {
                const target = getWord();
                const index = text.search(
                    new RegExp(escapeRegExp(target))
                );

                result = index === -1
                    ? `"${target}" was not found.`
                    : `"${target}" found at index ${index}.`;
                break;
            }

            // Extract characters using slice()
            case "slice":
                result = `slice(${start}, ${end}): ${text.slice(start, end)}`;
                break;

            // Extract characters using substring()
            case "substring":
                result = `substring(${start}, ${end}): ${text.substring(start, end)}`;
                break;

            // Extract characters using substr()
            // substr() uses a starting index and a length.
            case "substr":
                if (end < 0) {
                    throw new Error("Length cannot be negative.");
                }

                result = `substr(${start}, ${end}): ${text.substr(start, end)}`;
                break;

            // Replace the first occurrence
            case "replace": {
                const target = getWord();

                result = text.includes(target)
                    ? text.replace(target, replacement)
                    : `"${target}" was not found.`;

                break;
            }

            // Replace all occurrences
            case "replaceAll": {
                const target = getWord();

                result = text.includes(target)
                    ? text.replaceAll(target, replacement)
                    : `"${target}" was not found.`;

                break;
            }

            // Convert to uppercase
            case "upper":
                result = text.toUpperCase();
                break;

            // Convert to lowercase
            case "lower":
                result = text.toLowerCase();
                break;

            default:
                result = "Unknown string operation.";
        }

        showStringResult(result);
    } catch (error) {
        showStringResult(`Error: ${error.message}`);
    }
}

// Escape special characters when searching with RegExp
function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Attach click events to string buttons
document.querySelectorAll("[data-string]").forEach((button) => {
    button.addEventListener("click", () => {
        performStringOperation(button.dataset.string);
    });
});

// ------------------------------------
// MATH FUNCTIONS
// ------------------------------------

function performMathOperation(operation) {
    try {
        const a = getNumber(numberInput, "the first number");
        const b = getNumber(secondNumber, "the second number");

        let result;

        switch (operation) {
            // Power: a raised to b
            case "power":
                result = Math.pow(a, b);
                break;

            // Square root
            case "sqrt":
                if (a < 0) {
                    throw new Error(
                        "Square root of a negative number is not real."
                    );
                }

                result = Math.sqrt(a);
                break;

            // Round to the nearest integer
            case "round":
                result = Math.round(a);
                break;

            // Round upward
            case "ceil":
                result = Math.ceil(a);
                break;

            // Round downward
            case "floor":
                result = Math.floor(a);
                break;

            // Absolute value
            case "abs":
                result = Math.abs(a);
                break;

            // Sine of an angle in degrees
            case "sin":
                result = Math.sin(a * Math.PI / 180);
                break;

            // Cosine of an angle in degrees
            case "cos":
                result = Math.cos(a * Math.PI / 180);
                break;

            // Minimum of two numbers
            case "min":
                result = Math.min(a, b);
                break;

            // Maximum of two numbers
            case "max":
                result = Math.max(a, b);
                break;

            // Random integer in the inclusive range
            case "random": {
                const min = getNumber(minRandom, "the random minimum");
                const max = getNumber(maxRandom, "the random maximum");

                if (!Number.isInteger(min) || !Number.isInteger(max)) {
                    throw new Error(
                        "Random minimum and maximum must be integers."
                    );
                }

                if (min > max) {
                    throw new Error(
                        "Random minimum cannot exceed the maximum."
                    );
                }

                result = Math.floor(
                    Math.random() * (max - min + 1)
                ) + min;

                break;
            }

            default:
                result = "Unknown math operation.";
        }

        if (typeof result === "number" && !Number.isFinite(result)) {
            showMathResult(
                "The result is outside the supported finite number range."
            );
            return;
        }

        // Display up to 10 decimal places for readable results.
        if (typeof result === "number") {
            result = Number(result.toFixed(10));
        }

        showMathResult(`Result: ${result}`);
    } catch (error) {
        showMathResult(`Error: ${error.message}`);
    }
}

// Attach click events to math buttons
document.querySelectorAll("[data-math]").forEach((button) => {
    button.addEventListener("click", () => {
        performMathOperation(button.dataset.math);
    });
});

// ------------------------------------
// CLEAR BUTTONS
// ------------------------------------

document.getElementById("clearString").addEventListener("click", () => {
    textInput.value = "";
    wordInput.value = "";
    replaceInput.value = "";
    startIndex.value = "0";
    endIndex.value = "5";

    showStringResult("Your result will appear here.");
});

document.getElementById("clearMath").addEventListener("click", () => {
    numberInput.value = "";
    secondNumber.value = "";
    minRandom.value = "1";
    maxRandom.value = "100";

    showMathResult("Your result will appear here.");
});