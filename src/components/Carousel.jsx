import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { baseUrl } from "../utils/constants";
import axios from "axios";

const Carousel = ({ images, setImages }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 100,
    slidesToShow: 1,
    slidesToScroll: 1,
    // autoplay: true,
    autoplaySpeed: 2000,
  };

  const deleteImage = async (product_id, imagePath, index) => {
    const response = await axios.post(
      `${baseUrl}/product/deleteImageFromProduct`,
      {
        product_id,
        imagePath,
      }
    );
    console.log(response);
    const newImages = [...images]
    // alert(JSON.stringify(newImages))
    newImages.splice(index, 1);
    // alert(JSON.stringify(newImages))
    setImages(newImages);
  };

  return (
    <Slider {...settings}>
      {images.map(({ imgUrl, product_id }, index) => (
        <div key={index}>
          <img
            src={`${baseUrl}/${imgUrl}`}
            alt={`Slide ${index}`}
            className="rounded-md"
          />
          <button
            onClick={() => deleteImage(product_id, imgUrl, index)}
            className="w-24 px-2 py-1 bg-red-500 rounded-md border border-gray-200 text-white"
          >
            Delete
          </button>
        </div>
      ))}
    </Slider>
  );
};

export default Carousel;
