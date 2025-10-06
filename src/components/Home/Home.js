import React from "react";
import Carousel from "../Carousel/Carousel";

const Home = () => {
  const slides = [
    <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjzS14vB-yzHcomvltwBjrwJTxElXpKs4zbreltCQ5TT1OufhVEbwIITF6B_C1xNjaPfBP49zjDa0Ua_LFiv6kjhW1LJUc55qLjvGNtf5WfdJRTAnjiBMHXdjOcqVQ9e-Z5JX1aWoOibtChVZQsu3B-2ScIbIGKgAgqc8hAC84u1f2eucNu5D03MAv3cm3y/s320/riceMill1.webp" alt="Slide 1" />,
    <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEieIKYvhoEoJX8LQBF3UzQ_r5LiLdYrtFjgQGj4z1Wcf_kX31Xi8xV41dyq5LkOyoinZxvNApGYWiYWtlS5KHaPf-m6ps0faXjpBIQhyK5M43uCOY29CLKdhNncsXIDOMBKIAmGfpJt1BvXxdUWJa1iKDq-X9eZuPjL88kFWmCGLp6lI8l2KO5z_1liMX-G/s1024/riceMill.webp" alt="Slide 2" />,
    <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEieIKYvhoEoJX8LQBF3UzQ_r5LiLdYrtFjgQGj4z1Wcf_kX31Xi8xV41dyq5LkOyoinZxvNApGYWiYWtlS5KHaPf-m6ps0faXjpBIQhyK5M43uCOY29CLKdhNncsXIDOMBKIAmGfpJt1BvXxdUWJa1iKDq-X9eZuPjL88kFWmCGLp6lI8l2KO5z_1liMX-G/s1024/riceMill.webp" alt="Slide 2" />
  ];
  return (
    <div style={{ padding: "20px" }}>
       <Carousel slides={slides} />
      <h1>Welcome to the Rice Mill Management System</h1>
      <p>This is the dashboard. Use the menu to navigate to different modules.</p>
    </div>
  );
};

export default Home;
