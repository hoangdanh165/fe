import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

const Root = () => {
  useEffect(() => {
    const scripts = [
      '/js/jquery-3.3.1.min.js',
      '/js/bootstrap.min.js',
      '/js/jquery.magnific-popup.min.js',
      '/js/masonry.pkgd.min.js',
      '/js/jquery.barfiller.js',
      '/js/jquery.slicknav.js',
      '/js/owl.carousel.min.js',
      '/js/main.js'
    ];

    scripts.forEach(src => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    });

    return () => {
      scripts.forEach(src => {
        const script = document.querySelector(`script[src="${src}"]`);
        if (script) {
          document.body.removeChild(script);
        }
      });
    };
  }, []);

return (
    <>
        <Helmet>
        <link href="https://fonts.googleapis.com/css?family=Muli:300,400,500,600,700,800,900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Oswald:300,400,500,600,700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/css/bootstrap.min.css" type="text/css" />
        <link rel="stylesheet" href="/css/font-awesome.min.css" type="text/css" />
        <link rel="stylesheet" href="/css/flaticon.css" type="text/css" />
        <link rel="stylesheet" href="/css/owl.carousel.min.css" type="text/css" />
        <link rel="stylesheet" href="/css/barfiller.css" type="text/css" />
        <link rel="stylesheet" href="/css/magnific-popup.css" type="text/css" />
        <link rel="stylesheet" href="/css/slicknav.min.css" type="text/css" />
        <link rel="stylesheet" href="/css/style.css" type="text/css" />
        </Helmet>

        <>
            {/* Page Preloder */}
            <div id="preloder">
                <div className="loader"></div>
            </div>

            {/* Offcanvas Menu Section Begin */}
            <div className="offcanvas-menu-overlay"></div>
            <div className="offcanvas-menu-wrapper">
                <div className="canvas-close">
                <i className="fa fa-close"></i>
                </div>
                <div className="canvas-search search-switch">
                <i className="fa fa-search"></i>
                </div>
                <nav className="canvas-menu mobile-menu">
                <ul>
                    <li><a href="./index.html">Home</a></li>
                    <li><a href="./about-us.html">About Us</a></li>
                    <li><a href="./classes.html">Classes</a></li>
                    <li><a href="./services.html">Services</a></li>
                    <li><a href="./team.html">Our Team</a></li>
                    <li><a href="#">Pages</a>
                    <ul className="dropdown">
                        <li><a href="./about-us.html">About us</a></li>
                        <li><a href="./class-timetable.html">Classes timetable</a></li>
                        <li><a href="./bmi-calculator.html">Bmi calculate</a></li>
                        <li><a href="./team.html">Our team</a></li>
                        <li><a href="./gallery.html">Gallery</a></li>
                        <li><a href="./blog.html">Our blog</a></li>
                        <li><a href="./404.html">404</a></li>
                    </ul>
                    </li>
                    <li><a href="./contact.html">Contact</a></li>
                </ul>
                </nav>
                <div id="mobile-menu-wrap"></div>
                <div className="canvas-social">
                <a href="#"><i className="fa fa-facebook"></i></a>
                <a href="#"><i className="fa fa-twitter"></i></a>
                <a href="#"><i className="fa fa-youtube-play"></i></a>
                <a href="#"><i className="fa fa-instagram"></i></a>
                </div>
            </div>
            {/* Offcanvas Menu Section End */}

            {/* Hero Section Begin */}
            <section className="hero-section">
                <div className="hs-slider owl-carousel">
                <div className="hs-item set-bg" data-setbg="img/hero/hero-1.jpg">
                    <div className="container">
                    <div className="row">
                        <div className="col-lg-6 offset-lg-6">
                        <div className="hi-text">
                            <span>Shape your body</span>
                            <h1>Be <strong>strong</strong> training hard</h1>
                            <a href="#" className="primary-btn">Get info</a>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="hs-item set-bg" data-setbg="img/hero/hero-2.jpg">
                    <div className="container">
                    <div className="row">
                        <div className="col-lg-6 offset-lg-6">
                        <div className="hi-text">
                            <span>Shape your body</span>
                            <h1>Be <strong>strong</strong> training hard</h1>
                            <a href="#" className="primary-btn">Get info</a>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </section>
            {/* Hero Section End */}

            {/* ChoseUs Section Begin */}
            <section className="choseus-section spad">
                <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                    <div className="section-title">
                        <span>Why chose us?</span>
                        <h2>PUSH YOUR LIMITS FORWARD</h2>
                    </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-3 col-sm-6">
                    <div className="cs-item">
                        <span className="flaticon-034-stationary-bike"></span>
                        <h4>Modern equipment</h4>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        dolore facilisis.</p>
                    </div>
                    </div>
                    <div className="col-lg-3 col-sm-6">
                    <div className="cs-item">
                        <span className="flaticon-033-juice"></span>
                        <h4>Healthy nutrition plan</h4>
                        <p>Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel
                        facilisis.</p>
                    </div>
                    </div>
                    <div className="col-lg-3 col-sm-6">
                    <div className="cs-item">
                        <span className="flaticon-002-dumbell"></span>
                        <h4>Professional training plan</h4>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        dolore facilisis.</p>
                    </div>
                    </div>
                    <div className="col-lg-3 col-sm-6">
                    <div className="cs-item">
                        <span className="flaticon-014-heart-beat"></span>
                        <h4>Unique to your needs</h4>
                        <p>Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel
                        facilisis.</p>
                    </div>
                    </div>
                </div>
                </div>
            </section>
            {/* ChoseUs Section End */}

            {/* Classes Section Begin */}
            <section className="classes-section spad">
                <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                    <div className="section-title">
                        <span>Our Classes</span>
                        <h2>WHAT WE CAN OFFER</h2>
                    </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4 col-md-6">
                    <div className="class-item">
                        <div className="ci-pic">
                        <img src="img/classes/class-1.jpg" alt="" />
                        </div>
                        <div className="ci-text">
                        <span>STRENGTH</span>
                        <h5>Weightlifting</h5>
                        <a href="#"><i className="fa fa-angle-right"></i></a>
                        </div>
                    </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                    <div className="class-item">
                        <div className="ci-pic">
                        <img src="img/classes/class-2.jpg" alt="" />
                        </div>
                        <div className="ci-text">
                        <span>Cardio</span>
                        <h5>Indoor cycling</h5>
                        <a href="#"><i className="fa fa-angle-right"></i></a>
                        </div>
                    </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                    <div className="class-item">
                        <div className="ci-pic">
                        <img src="img/classes/class-3.jpg" alt="" />
                        </div>
                        <div className="ci-text">
                        <span>STRENGTH</span>
                        <h5>Kettlebell power</h5>
                        <a href="#"><i className="fa fa-angle-right"></i></a>
                        </div>
                    </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                    <div className="class-item">
                        <div className="ci-pic">
                        <img src="img/classes/class-4.jpg" alt="" />
                        </div>
                        <div className="ci-text">
                        <span>Cardio</span>
                        <h4>Indoor cycling</h4>
                        <a href="#"><i className="fa fa-angle-right"></i></a>
                        </div>
                    </div>
                    </div>
                    <div className="col-lg-6">
                    <div className="class-item">
                        <div className="ci-pic">
                        <img src="img/classes/class-5.jpg" alt="" />
                        </div>
                        <div className="ci-text">
                        <span>Training</span>
                        <h4>Boxing</h4>
                        <a href="#"><i className="fa fa-angle-right"></i></a>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </section>
            {/* Classes Section End */}

            {/* Banner Section Begin */}
            <section className="banner-section set-bg" data-setbg="img/banner-bg.jpg">
                <div className="container">
                <div className="row">
                    <div className="col-lg-12 text-center">
                    <div className="bs-text">
                        <h2>registration now to get more deals</h2>
                        <div className="bt-tips">Where health, beauty and fitness meet.</div>
                        <a href="#" className="primary-btn  btn-normal">Appointment</a>
                    </div>
                    </div>
                </div>
                </div>
            </section>
            {/* Banner Section End */}

            {/* Pricing Section Begin */}
            <section className="pricing-section spad">
                <div className="container">
                    <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title">
                        <span>Our Plan</span>
                        <h2>Choose your pricing plan</h2>
                        </div>
                    </div>
                    </div>
                    <div className="row justify-content-center">
                    <div className="col-lg-4 col-md-8">
                        <div className="ps-item">
                        <h3>Class drop-in</h3>
                        <div className="pi-price">
                            <h2>$ 39.0</h2>
                            <span>SINGLE CLASS</span>
                        </div>
                        <ul>
                            <li>Free riding</li>
                            <li>Unlimited equipments</li>
                            <li>Personal trainer</li>
                            <li>Weight losing classes</li>
                            <li>Month to mouth</li>
                            <li>No time restriction</li>
                        </ul>
                        <a href="#" className="primary-btn pricing-btn">Enroll now</a>
                        <a href="#" className="thumb-icon"><i className="fa fa-picture-o"></i></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-8">
                        <div className="ps-item">
                        <h3>12 Month unlimited</h3>
                        <div className="pi-price">
                            <h2>$ 99.0</h2>
                            <span>SINGLE CLASS</span>
                        </div>
                        <ul>
                            <li>Free riding</li>
                            <li>Unlimited equipments</li>
                            <li>Personal trainer</li>
                            <li>Weight losing classes</li>
                            <li>Month to mouth</li>
                            <li>No time restriction</li>
                        </ul>
                        <a href="#" className="primary-btn pricing-btn">Enroll now</a>
                        <a href="#" className="thumb-icon"><i className="fa fa-picture-o"></i></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-8">
                        <div className="ps-item">
                        <h3>6 Month unlimited</h3>
                        <div className="pi-price">
                            <h2>$ 59.0</h2>
                            <span>SINGLE CLASS</span>
                        </div>
                        <ul>
                            <li>Free riding</li>
                            <li>Unlimited equipments</li>
                            <li>Personal trainer</li>
                            <li>Weight losing classes</li>
                            <li>Month to mouth</li>
                            <li>No time restriction</li>
                        </ul>
                        <a href="#" className="primary-btn pricing-btn">Enroll now</a>
                        <a href="#" className="thumb-icon"><i className="fa fa-picture-o"></i></a>
                        </div>
                    </div>
                    </div>
                </div>
            </section>
        </>
    </>
);
}

export default Root;

