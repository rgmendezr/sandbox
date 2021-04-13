<?php

//PHP Example 

function data($title = "My data"){
    
    $data = [
        "title" => $title,
        "firstName" => "Raúl",
        "lastName" => "Méndez Rodríguez",
        "email" => "raul.mendezrodriguez@ucr.ac.cr",
        "phone" => "Momentarily no phone",
        "from" => "San Ramón of Alajuela, Costa Rica",
    ];

    return $data;
}

$post = json_decode(file_get_contents('php://input'), true);

if(isset($post['GIVE_ME_PLEASE'])){
    die(json_encode(data()));
}

?>

<!-- HTML Example  -->
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV</title>

    <!-- JavaScript-->
    <script>
        /* General functions */
        function byId(id) {
            return document.getElementById(id);
        }

        function byTag(name) {
            return document.getElementsByTagName(name);
        }

        function byClass(className) {
            return document.getElementsByClassName(className);
        }
    </script>

    <!-- CSS3 Example -->
    <style>
        /* General styles*/
        body {
            font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
        }
    </style>

    <style>
        /* Header styles */
        /* Mobile first */

        .header,
        .head,
        .companyName,
        .slogan,
        .menu {
            -webkit-transition: all 0.2s ease-out;
            -moz-transition: all 0.2s ease-out;
            -ms-transition: all 0.2s ease-out;
            -o-transition: all 0.2s ease-out;
            transition: all 0.2s ease-out;
        }

        .header {
            position: fixed;
            width: 100%;
            top: 0px;
            left: 0px;
            background-color: hotpink;
            color: #FFF;
            padding: auto;
            padding: 20px auto 5px;
            text-align: center;
            min-width: 320px;
            z-index: 3;
        }

        .head {
            width: 100%;
        }

        .myName {
            margin-top: 20px;
        }

        .slogan {
            font-size: 25;
        }

        .menu {
            margin: 15px auto 3px;
            width: 90%;
        }

        .link {
            width: 33.3%;
            float: left;
            color: #FFF;
            font-size: 18px;
            padding: 10px 0px;
            text-align: center;
            border-top: 1px solid #DDD;
            cursor: pointer;
        }

        .header-action {
            animation-duration: 3s;
            animation-name: animation;
        }

        @keyframes animation {
            0% {
                opacity: 1;
            }

            50% {
                opacity: 0;
            }

            100% {
                opacity: 1;
            }
        }

        .header-action-2 {
            animation-duration: 3s;
            animation-name: animation-2;
        }

        @keyframes animation-2 {
            0% {
                top: 0%;
            }

            50% {
                background-color: darkslategrey;
                top: 100%;
            }

            51% {
                top: -100%;
                background-color: red;
            }

            100% {
                top: 0%;
            }
        }

        @media (min-width: 640px) {
            .header {
                padding: 5px auto;
            }

            .head {
                width: 30%;
                float: left;
                margin: 5px auto;
            }

            .myName {
                text-align: left;
                margin-left: 30px;
                margin-top: 10px;
                font-size: 20px;
            }

            .slogan {
                display: none;
            }

            .menu {
                width: 65%;
                max-width: 500px;
                float: right;
                border: 0px;
                margin: 5px 5% 5px auto;
                color: darkgreen;
            }

            .link {
                width: 31.3%;
                margin: auto 1%;
                border: 0px;
            }

        }
    </style>

</head>

<body>

    <!-- Top of page -->
    <header class="header header-action">

        <div class="head">

            <h1 class="myName">Raúl Méndez R.</h1>
            <h3 class="slogan">The right person</h3>

        </div>

        <nav class="menu">

            <div class="link" id="link-red">Red</div>
            <div class="link" id="link-action">Do something</div>

            <!-- One way to call JavaScript -->
            <div class="link" onclick="header.changeColor('#333')">Black</div>

        </nav>

        <!-- Header Javascript -->
        <script>
            //JSON
            var header = {

                // Generate the event trigger
                start: function () {
                    byId('link-red').addEventListener("click", () => {
                        this.changeColor('crimson');
                    }, false);
                    byId('link-action').addEventListener("click", this.action, false);
                    this.rememberColor();
                },

                //Add the animation to the header
                action: function (e) {
                    e.preventDefault();
                    byClass('header')[0].classList.toggle("header-action");
                    byClass('header')[0].classList.toggle("header-action-2");

                },

                //Change the header color
                changeColor: function (color) {
                    byTag("header")[0].style.backgroundColor = color;
                    this.saveColor(color);
                },

                //Save the color using localstorage
                saveColor: function (color) {
                    window.localStorage.setItem("header-color", color);
                },

                //Upon re-entering the page, the last selected color will be displayed.
                rememberColor: function () {
                    let color = window.localStorage.getItem("header-color");
                    if (typeof color !== 'undefined' && color !== null) {
                        this.changeColor(color);
                    }
                }
            }
        </script>

    </header>


    <!-- Page Content -->
    <div class="splash-box">
        <div class="splash">
            <h1 class="splash-head" id="title">PLAYING PROGRAMMING</h1>
            <p>
                <button href="signup/" class="p-button p-button-primary" id="button-primary">Change title</button>
            </p>
            <p class="splash-subhead" id="sentence">
                Let's do magic!
            </p>
            <p>
                <input type="text" class="input-text" value="" placeholder="Write something here">
            </p>
        </div>

        <!-- Content JavaScript -->
        <script>
            //JSON FORMAT
            var hello = {

                //Events assigner 
                start: function () {

                    //Using the general function to search by id
                    byId("button-primary").addEventListener("click", () => {
                        this.changeTitile();
                    }, false);

                    //Using the general function to search by class
                    byClass('input-text')[0].addEventListener("keyup", this.write, false);
                },

                //JSON object variable
                counter: 0,

                //Change and reset the title
                changeTitile: function (text = undefined) {
                    if (this.counter == 0) {
                        byId('title').innerText = (typeof text === 'undefined') ? "Hello Captain!" : text;
                        byId("button-primary").innerText = "Reset title";
                        this.counter++;
                    } else {
                        byId('title').innerText = "PLAYING PROGRAMMING";
                        byId("button-primary").innerText = "Change title";
                        this.counter--;
                    }

                },

                //Write the entered phrase backwards
                write: function () {
                    if (byClass('input-text')[0].value == "") {
                        byId('sentence').innerText = "Let's do magic!";
                    } else {
                        //Call to reverseString method
                        byId('sentence').innerText = hello.reverseString(byClass('input-text')[0].value);
                    }

                },

                //Turn the string backwards
                reverseString: function (string) {
                    var x = string.length;
                    var newString = "";
                    while (x >= 0) {
                        newString = newString + string.charAt(x);
                        x--;
                    }
                    return newString;
                }

            }
        </script>

        <!-- content Styles -->
        <style>
            /* Desktop first */

            .splash-box {
                background: #666;
                background-image: linear-gradient(140deg, #EADEDB 0%, #BC70A4 50%, #BFD641 75%);
                z-index: 1;
                overflow: hidden;
                width: 100%;
                height: 98%;
                top: 0;
                left: 0;
                position: fixed !important;
                min-width: 320px;
                overflow: auto;
            }

            .splash {
                width: 80%;
                height: 50%;
                margin: auto;
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                text-align: center;
                text-transform: uppercase;
            }

            .splash-head {
                font-size: 3em;
                font-weight: bold;
                color: white;
                padding: 1em auto;
                font-weight: 100;
                border-radius: 0.3em;
                line-height: 1em;
                margin-bottom: 1em;
            }

            .splash-subhead {
                color: white;
                letter-spacing: 0.05em;
                opacity: 0.8;
                font-size: 2em;
                animation-iteration-count: infinite;
                animation-duration: 7s;
                animation-name: sentence-animation;
                border: 5px solid rgba(255, 255, 255, 0);
            }

            @keyframes sentence-animation {
                0% {
                    border: 5px solid rgba(255, 255, 255, 0);
                }

                20% {
                    border-top: 5px solid #FFF;
                }

                40% {
                    border-right: 5px solid #FFF;
                }

                60% {
                    border-bottom: 5px solid #FFF;
                }

                80% {
                    border-left: 5px solid #FFF;
                }

                100% {
                    border: 5px solid rgba(255, 255, 255, 0);
                }

            }

            .splash-box p {
                margin-top: 2em;
            }

            .p-button {
                background-color: #1f8dd6;
                color: white;
                padding: 0.5em 4em;
                border-radius: 0.3em;
                border: 0px;
                cursor: pointer;
                outline: none;
            }

            .p-button-primary {
                background: crimson;
                color: #FFF;
                border-radius: 2em;
                font-size: 1.5em;
                margin-top: 0.8em;
            }

            .input-text {
                padding: 1em ;
                text-align: center;
                font-size: 1em;
                border-radius: 1em;
                outline: none;
                border: #666;
                color: crimson;
                font-weight: bold;
                margin-bottom: 50px;
            }

            @media (max-width: 640px) {

                .splash {
                    top: 10em;
                }

                .splash-head {
                    padding: 1em auto;
                    font-size: 2em;
                }

                .splash-subhead {
                    font-size: 1.5em;
                }

                .p-button-primary {
                    font-size: 1em;
                }
            }
        </style>
    </div>

    <!-- Data Container -->
    <footer id="footer">

        <!-- The data is loaded in this div -->
        <div id="footer-content">
            <h3 id="footer-title"></h3>
        </div>

        <!-- Footer JavaScript-->
        <script>
            var footer = {

                //Make a post call to the same file
                start: function () {
                    fetch(location.search, {
                        method: 'post',
                        headers: {
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            GIVE_ME_PLEASE: true
                        })
                    }).then(function (response) {

                        //Print the response
                        response.json().then(data => {
                            byId('footer-title').innerText = data.title;
                            byId('footer-content').innerHTML += "<p>" + data.firstName + " " +
                                data
                                .lastName + "</p>";
                            byId('footer-content').innerHTML += "<p>" + data.email + "</p>";
                            byId('footer-content').innerHTML += "<p>" + data.phone + "</p>";
                            byId('footer-content').innerHTML += "<p>" + data.from + "</p>";
                        });
                    });
                }
            };
        </script>

        <!-- Footes Styles -->
        <style>
            footer {
                padding: 10% 0px;
                position: absolute;
                top: 98%;
                left: 0px;
                width: 100%;
                min-height: 80%;
                background-color: #f9f9f9;
                color: #333;
                z-index: 2;
                text-align: center;
                min-width: 320px;
            }

            footer div {
                width: 100%;
                height: 200px;
                margin: auto;
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                text-align: center;
                text-transform: uppercase;
            }

            footer p {
                margin-top: 20px;
            }
        </style>

    </footer>

    <!-- First script is to run when loading the page -->
    <script>
        window.onload = () => {
            header.start();
            hello.start();
            footer.start();
        };
    </script>

</body>

</html>