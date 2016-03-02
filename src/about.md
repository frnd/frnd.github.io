---
name: About
template: page.html
priority: 3
linkTitle: About
---

Hello! my name is Fernando González. I'm <span id="years">36</span>-years old web developer and software engineer currently based on Madrid (Spain).

<script>
(function() {
  var today = new Date();
    var birthDate = new Date('11-04-1979');
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    window.document.getElementById('years').innerHTML = age;
})();
</script>

My expertise and interest lies in Java and Web technologies:
<div class="columns-3">
  <ul>
    <li>Java</li>
    <li>JSF - Primefaces</li>
    <li>JPA - Hibernate</li>
    <li>Oracle/PostgreSQL</li>
    <li>Spring</li>
    <li>RESTEasy</li>
    <li>Maven and Jenkins</li>
  </ul>
</div>

I love learning new technologies and at this moment I'm focused on JavaScript:  
<div class="columns-3">
  <ul>
    <li>AngularJS</li>
    <li>Ionic (Cordova)</li>
    <li>NodeJS</li>
  </ul>
</div>

But I have some other in the backlog: Microservices, TypeScript, AngularJS 2, Apache Usergrid.

Here some projects hosted on github:

* An extension for Express to log all request to a server with a unique id called [winston-express-logger](https://github.com/frnd/winston-express-logger). This package is not published in npm because is still in beta.
* A [Metalsmith](http://metalsmith.io) plugin to assign each page with an image cover called [metalsmith-imagecover](https://github.com/frnd/metalsmith-imagecover).
* Also you can find the sources of this blog [frnd.github.io](https://github.com/frnd/frnd.github.io)

<!--
# Personal Manifesto:

* [KISS principle](https://en.wikipedia.org/wiki/KISS_principle)
* [Do not reinvent the wheel](https://en.wikipedia.org/wiki/Reinventing_the_wheel)

-->

# Contacting Me
You can contact me using one of the following methods. I do my best to be as accessible as possible.
<div class="columns-2">
      <p>Got a really interesting opportunity? You may contact me by email.</p>

      <p>fgo [at] outlook.com</p>
    <form action="http://getsimpleform.com/messages?form_api_token=a8edc001288720995f5b85bda98dee55" method="post" style="display:inline-block;">
            <!-- the redirect_to is optional, the form will redirect to the referrer on submission -->
            <input type='hidden' name='redirect_to' value='http://frnd.github.io/thank-you/' />
            <!-- all your input fields here.... -->
            <div class="form-group">
                <label for="yourName" class="col-sm-4 control-label">Your Name</label>
                <div class="col-sm-8">
                    <input type="text" class="form-control" id="yourName" name="yourName" placeholder="Your Name" required="true">
                </div>
            </div>
            <div class="form-group">
                <label for="yourEmail" class="col-sm-4 control-label">Your Email</label>
                <div class="col-sm-8">
                    <input type="email" class="form-control" id="yourEmail" name="yourEmail" placeholder="Your Email" required="true">
                </div>
            </div>
            <div class="form-group">
                <label for="yourMessage" class="col-sm-4 control-label">Your Message</label>
                <div class="col-sm-8">
                    <textarea class="form-control" id="yourMessage" name="yourMessage" rows="3"  required="true"></textarea>
                </div>
            </div>
        <div class="form-group">
            <div class="col-lg-offset-4 col-sm-8">
                <button type="submit" class="btn btn-default">Submit</button>
            </div>
        </div>
    </form>
</div>
