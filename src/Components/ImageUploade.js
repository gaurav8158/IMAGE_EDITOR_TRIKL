import React, { useState, useRef } from 'react';
import { Stage, Layer, Image, Text, Rect } from 'react-konva';
import { FaUpload} from 'react-icons/fa';
const ImageUploade = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [elements, setElements] = useState([]); // Combine logos and text elements
  const [canvasWidth, setCanvasWidth] = useState(800);
  const [canvasHeight, setCanvasHeight] = useState(600);
  const [newText, setNewText] = useState('Your Text Here'); // Input field value
  const [selectColor, seSelectColor] = useState("white");
  const imageRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const img = new window.Image();
      img.src = reader.result;

      img.onload = () => {
        setUploadedImage({
          image: img,
          width: img.width,
          height: img.height,
        });
      };
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const img = new window.Image();
      img.src = reader.result;

      img.onload = () => {
        // Add logos with zIndex to control stacking order
        setElements([...elements, { type: 'logo', image: img, x: 100, y: 100, zIndex: elements.length }]);
      };
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleTextAdd = () => {
    console.log(newText)
    const textObject = {
      type: "text",
      text: newText,
      x: 100,
      y: 100,
      fontSize: 20,
      fill: selectColor,
      zIndex: elements.length, // Set zIndex based on the order of addition
    };
    setElements([...elements, textObject]);
    console.log(elements);
  };

  const handleDownloadClick = () => {
    const stage = imageRef.current;
    const dataURL = stage.toDataURL();
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'edited_image.png';
    link.click();
  };

  const hiddenFileInput = useRef(null);
  const handleClick = event => {
    hiddenFileInput.current.click();
  };

  const hiddenFileInputlogo= useRef(null);
  const handleClickLogo = event => {
    hiddenFileInputlogo.current.click();
  };
 
  return (
    <div className="flex flex-row mt-20">
      <div className="flex flex-col w-1/3 p-4">
        <div
          onClick={handleClick}
          className="cursor-pointer flex flex-col items-center p-2 bg-blue-500 text-white mb-4"
        >
          <FaUpload />
          <div>Upload Image</div>
        </div>
        <input
          ref={hiddenFileInput}
          style={{ display: 'none' }}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />

        <div
          onClick={handleClickLogo}
          className="cursor-pointer flex flex-col items-center p-2 bg-green-700 text-white mb-4"
        >
          <FaUpload />
          <div>Upload Logo</div>
        </div>
        <input
          ref={hiddenFileInputlogo}
          style={{ display: 'none' }}
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
        />

        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Your Text Here"
          className="p-2 mb-2 border border-gray-300 rounded"
        />
        <input
          type="color"
          value={selectColor}
          onChange={(e) => seSelectColor(e.target.value)}
          className="p-2 mb-2 border border-gray-300 rounded"
        />
        <button
         className="p-2 mb-2 bg-indigo-500 text-white rounded"
          onClick={handleTextAdd}
        >
          Add Text
        </button>
        <button
          className="p-2 bg-stone-300 text-black rounded"
          onClick={handleDownloadClick}
        >
          Download
        </button>
      </div>

      <div className="flex flex-col w-2/3 p-4">
      <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
        {uploadedImage && (
          <Stage width={canvasWidth} height={canvasHeight} ref={imageRef}>
            <Layer>
              <Image
                image={uploadedImage.image}
                width={canvasWidth}
                height={canvasHeight}
             
              />
              {elements.map((element, index) => {
                if (element.type === 'logo') {
                  return (
                    <Image
                      key={index}
                      image={element.image}
                      x={element.x}
                      y={element.y}
                      scaleX={0.1} // Adjust the scale for the logo
                      scaleY={0.1}
                      draggable
                      zIndex={element.zIndex}
                    />
                  );
                } else if (element.type === 'text') {
                  return (
                    <Text
                      key={index}
                      text={element.text}
                      x={element.x}
                      y={element.y}
                      fontSize={element.fontSize}
                      fill={element.fill}
                      draggable
                      zIndex={element.zIndex}
                    />
                  );
                }
              })}
            </Layer>
          </Stage>
        )}
        </div>
      </div>
    </div>
  );

};
export default ImageUploade;