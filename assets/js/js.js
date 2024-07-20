// listing vars here so they're in the global scope
var cards, nCards, cover, openContent, openContentText, pageIsOpen = false,
    openContentImage, closeContent, windowWidth, windowHeight, currentCard;

// initiate the process
var paragraphTexts = [
    'This is the paragraph text for Card 1.',
    'This is the paragraph text for Card 2.',
    'This is the paragraph text for Card 3.'
  ];
init();

function init() {
  resize();
  selectElements();
  attachListeners();
}

// select all the elements in the DOM that are going to be used
function selectElements() {
  cards = document.getElementsByClassName('card'),
  nCards = cards.length,
  cover = document.getElementById('cover'),
  openContent = document.getElementById('open-content'),
  openContentText = document.getElementById('open-content-text'),
  openContentImage = document.getElementById('open-content-image')
  closeContent = document.getElementById('close-content');
}

/* Attaching three event listeners here:
  - a click event listener for each card
  - a click event listener to the close button
  - a resize event listener on the window
*/
function attachListeners() {
  for (var i = 0; i < nCards; i++) {
    attachListenerToCard(i);
  }
  closeContent.addEventListener('click', onCloseClick);
  window.addEventListener('resize', resize);
}

function attachListenerToCard(i) {
  cards[i].addEventListener('click', function(e) {
    var card = getCardElement(e.target);
    onCardClick(card, i);
  })
}

/* When a card is clicked */
function onCardClick(card, i) {
  // set the current card
  currentCard = card;
  // add the 'clicked' class to the card, so it animates out
  currentCard.className += ' clicked';
  // animate the card 'cover' after a 500ms delay
  setTimeout(function() {animateCoverUp(currentCard)}, 500);
  // animate out the other cards
  animateOtherCards(currentCard, true);
  // add the open class to the page content
  openContent.className += ' open';
}

/*
* This effect is created by taking a separate 'cover' div, placing
* it in the same position as the clicked card, and animating it to
* become the background of the opened 'page'.
* It looks like the card itself is animating in to the background,
* but doing it this way is more performant (because the cover div is
* absolutely positioned and has no children), and there's just less
* having to deal with z-index and other elements in the card
*/
function animateCoverUp(card) {
  // get the position of the clicked card
  var cardPosition = card.getBoundingClientRect();
  // get the style of the clicked card
  var cardStyle = getComputedStyle(card);
  setCoverPosition(cardPosition);
  setCoverColor(cardStyle);
  scaleCoverToFillWindow(cardPosition);
  // update the content of the opened page
  openContentText.innerHTML = '<h1>'+card.children[2].textContent+'</h1>'+paragraphText;
  openContentImage.src = card.children[1].src;
  setTimeout(function() {
    // update the scroll position to 0 (so it is at the top of the 'opened' page)
    window.scroll(0, 0);
    // set page to open
    pageIsOpen = true;
  }, 300);
}

function animateCoverBack(card) {
  var cardPosition = card.getBoundingClientRect();
  // the original card may be in a different position, because of scrolling, so the cover position needs to be reset before scaling back down
  setCoverPosition(cardPosition);
  scaleCoverToFillWindow(cardPosition);
  // animate scale back to the card size and position
  cover.style.transform = 'scaleX('+1+') scaleY('+1+') translate3d('+(0)+'px, '+(0)+'px, 0px)';
  setTimeout(function() {
    // set content back to empty
    openContentText.innerHTML = '';
    openContentImage.src = '';
    // style the cover to 0x0 so it is hidden
    cover.style.width = '0px';
    cover.style.height = '0px';
    pageIsOpen = false;
    // remove the clicked class so the card animates back in
    currentCard.className = currentCard.className.replace(' clicked', '');
  }, 301);
}

function setCoverPosition(cardPosition) {
  // style the cover so it is in exactly the same position as the card
  cover.style.left = cardPosition.left + 'px';
  cover.style.top = cardPosition.top + 'px';
  cover.style.width = cardPosition.width + 'px';
  cover.style.height = cardPosition.height + 'px';
}

function setCoverColor(cardStyle) {
  // style the cover to be the same color as the card
  cover.style.backgroundColor = cardStyle.backgroundColor;
}

function scaleCoverToFillWindow(cardPosition) {
  // calculate the scale and position for the card to fill the page,
  var scaleX = windowWidth / cardPosition.width;
  var scaleY = windowHeight / cardPosition.height;
  var offsetX = (windowWidth / 2 - cardPosition.width / 2 - cardPosition.left) / scaleX;
  var offsetY = (windowHeight / 2 - cardPosition.height / 2 - cardPosition.top) / scaleY;
  // set the transform on the cover - it will animate because of the transition set on it in the CSS
  cover.style.transform = 'scaleX('+scaleX+') scaleY('+scaleY+') translate3d('+(offsetX)+'px, '+(offsetY)+'px, 0px)';
}

/* When the close is clicked */
function onCloseClick() {
  // remove the open class so the page content animates out
  openContent.className = openContent.className.replace(' open', '');
  // animate the cover back to the original position card and size
  animateCoverBack(currentCard);
  // animate in other cards
  animateOtherCards(currentCard, false);
}

function animateOtherCards(card, out) {
  var delay = 100;
  for (var i = 0; i < nCards; i++) {
    // animate cards on a stagger, 1 each 100ms
    if (cards[i] === card) continue;
    if (out) animateOutCard(cards[i], delay);
    else animateInCard(cards[i], delay);
    delay += 100;
  }
}

// animations on individual cards (by adding/removing card names)
function animateOutCard(card, delay) {
  setTimeout(function() {
    card.className += ' out';
   }, delay);
}

function animateInCard(card, delay) {
  setTimeout(function() {
    card.className = card.className.replace(' out', '');
  }, delay);
}

// this function searches up the DOM tree until it reaches the card element that has been clicked
function getCardElement(el) {
  if (el.className.indexOf('card ') > -1) return el;
  else return getCardElement(el.parentElement);
}


// resize function - records the window width and height
function resize() {
  if (pageIsOpen) {
    // update position of cover
    var cardPosition = currentCard.getBoundingClientRect();
    setCoverPosition(cardPosition);
    scaleCoverToFillWindow(cardPosition);
  }
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
}

var paragraphText = `
<b>1. Understand the Local Market</b><br>
<b>Market Research:</b> Understand the needs and preferences of the local population. Conduct surveys, focus groups, and informal interviews to gather insights.<br>
<b>Gap Analysis:</b> Identify gaps in the local market where your business can provide value, whether it's through products, services, or experiences that are currently unavailable or insufficiently served.<br><br>

<b>2. Leverage Local Resources</b><br>
<b>Raw Materials:</b> Utilize locally available raw materials to reduce costs and support the local economy.<br>
<b>Labor Force:</b> Hire local talent. Training and employing locals can create loyalty and reduce turnover.<br><br>

<b>3. Build Strong Community Relationships</b><br>
<b>Community Engagement:</b> Participate in local events and sponsor community activities. Building strong relationships with local residents can help in establishing trust and loyalty.<br>
<b>Local Partnerships:</b> Collaborate with other local businesses for mutual benefits. For example, a local farm could partner with a village restaurant to supply fresh produce.<br><br>

<b>4. Adopt Appropriate Marketing Strategies</b><br>
<b>Word of Mouth:</b> Encourage satisfied customers to spread the word. In tight-knit communities, personal recommendations can be very powerful.<br>
<b>Local Media:</b> Advertise in local newspapers, radio stations, and community boards. Ensure your business is listed in local directories.<br>
<b>Social Media:</b> Use social media platforms to reach a broader audience, even in rural areas. Platforms like Facebook and WhatsApp are commonly used and can help spread the word about your business.<br><br>

<b>5. Focus on Quality and Customer Service</b><br>
<b>Quality Products/Services:</b> Ensure that your products or services are of high quality. This will build a strong reputation over time.<br>
<b>Customer Service:</b> Provide excellent customer service to create repeat customers. Personalized service can set you apart in a rural setting.<br><br>

<b>6. Diversify Income Streams</b><br>
<b>Multiple Products/Services:</b> Offer a range of products or services to meet various needs of the local population.<br>
<b>Seasonal Products:</b> Adapt your offerings to seasonal demands. For example, sell agricultural products during harvest season and handmade crafts during holiday seasons.<br><br>

<b>7. Invest in Training and Development</b><br>
<b>Skills Development:</b> Train your employees to improve their skills, which will enhance the overall quality of your business.<br>
<b>Self-Improvement:</b> As a business owner, continuously seek opportunities for your own professional development.<br><br>

<b>8. Leverage Technology</b><br>
<b>Online Presence:</b> Create a website and maintain an active social media presence to reach a wider audience beyond the local community.<br>
<b>E-commerce:</b> Explore opportunities for online sales, which can help you reach customers in urban areas and beyond.<br><br>

<b>9. Seek Financial Support</b><br>
<b>Grants and Subsidies:</b> Research and apply for government grants and subsidies available for rural businesses.<br>
<b>Microloans:</b> Consider microloans and other financial products tailored for small businesses in rural areas.<br>
<b>Local Investors:</b> Seek investment from local individuals who might be interested in supporting local businesses.<br><br>

<b>10. Adapt to Local Infrastructure</b><br>
<b>Logistics:</b> Develop efficient logistics and supply chain strategies to manage the distribution of goods, even in areas with limited infrastructure.<br>
<b>Renewable Energy:</b> Consider using renewable energy sources like solar power to mitigate unreliable electricity supply.<br><br>

<b>11. Sustainable Practices</b><br>
<b>Eco-Friendly:</b> Implement sustainable practices to appeal to environmentally conscious customers and reduce operational costs.<br>
<b>Community Development:</b> Invest in community development projects, which can build goodwill and support long-term business sustainability.<br>
`;

console.log(paragraphText);
