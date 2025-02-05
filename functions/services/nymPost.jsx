// t-shirt 3 and hoodie 3
const { JSX, Builder } = require("canvacord");
const { Font } = require("canvacord");
const { createCanvas } = require("@napi-rs/canvas");
const path = require("path");

Font.fromFileSync(
  path.join(
    __dirname,
    "../public/assets/fonts/BubbleGum/BubblegumSans-Regular.ttf"
  ),
  "BubbleGum"
);

class NymPost extends Builder {
  constructor({
    width = 3852,
    height = 4398,
    nymFontSize = "570px",
    nymLineHeight = "662.91px",
    Nym = "",
    NymColor = "#000000",
    formatNym = false,
    top = 245,
    left = 223,
    nymWidth = 3505,
    nymHeight = 3989,
  } = {}) {
    super(width, height);
    this.bootstrap({
      Nym,
      NymColor,
      nymFontSize,
    });

    this.styles = {
      width,
      height,
      nymFontSize,
      nymLineHeight,
      formatNym,
      nymWidth,
      nymHeight,
      top,
      left,
    };
  }

  setNym(value) {
    this.options.set("Nym", value);
    return this;
  }

  setNymcolor(value) {
    this.options.set("");
  }

  async render() {
    const { Nym, NymColor } = this.options.getOptions();
    const {
      width,
      height,
      nymFontSize,
      nymLineHeight,
      formatNym,
      nymWidth,
      nymHeight,
      top,
      left,
    } = this.styles;

    const maxContainerHeight = nymHeight;
    const padding = 120;
    const adjustedHeight = maxContainerHeight + padding;

    let currentFontSize = parseFloat(nymFontSize);
    const nymLineHeightNum = parseFloat(nymLineHeight);
    const lineHeightRatio = nymLineHeightNum / currentFontSize;

    const canvas = createCanvas(1, 1);
    const context = canvas.getContext("2d");

    // Unified function to calculate text dimensions
    const getTextDimensions = (text, maxWidth) => {
      context.font = `${currentFontSize}px Arial`; // Use the same font as in Code 1
      const words = text.split(" ");
      let line = "";
      let lines = [];
      let maxLineWidth = 0;

      words.forEach((word) => {
        const testLine = `${line}${word} `;
        const testWidth = context.measureText(testLine).width;

        if (testWidth > maxWidth && line) {
          lines.push(line);
          line = `${word} `;
        } else {
          line = testLine;
        }
        maxLineWidth = Math.max(maxLineWidth, testWidth);
      });

      if (line) lines.push(line);

      const textHeight = lines.length * (currentFontSize * lineHeightRatio); // Use lineHeightRatio for line height
      return { textHeight, textWidth: maxLineWidth, lineCount: lines.length };
    };

    // Calculate initial text dimensions
    let { textHeight, textWidth } = getTextDimensions(Nym, nymWidth);

    console.log("Initial Text Dimensions:", { textHeight, textWidth });

    // Adjust font size until the text fits within the height
    while (textHeight > adjustedHeight && currentFontSize > 1) {
      console.log("Reducing font size:", currentFontSize, "Text Dimensions:", {
        textHeight,
        textWidth,
      });
      currentFontSize -= 1;
      ({ textHeight, textWidth } = getTextDimensions(Nym, nymWidth));
    }

    console.log("Final Font Size:", currentFontSize);

    // Calculate final styles
    const finalNymFontSize = `${currentFontSize}px`;
    const finalNymLineHeight = `${currentFontSize * lineHeightRatio}px`;

    const formattedNym = formatNym ? Nym.toUpperCase() : Nym;

    // Log the results
    console.log({
      finalFontSize: finalNymFontSize,
      finalLineHeight: finalNymLineHeight,
      formattedText: formattedNym,
    });

    return JSX.createElement(
      "div",
      {
        style: {
          width: `${width}px`,
          height: `${height}px`,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        },
      },
      JSX.createElement(
        "h1",
        {
          style: {
            fontSize: finalNymFontSize,
            fontFamily: "BubbleGum",
            color: NymColor,
            lineHeight: finalNymLineHeight,
            whiteSpace: "pre-wrap",
            width: `${nymWidth}px`,
            height: `${nymHeight}px`,
            marginTop: `${top}px`,
            paddingLeft: `0 0 0 ${left}px`,
            textTransform: "uppercase",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
          },
        },
        formattedNym
      )
    );
  }
}

module.exports = { NymPost };
