/* ==========================================================
   DATA: all the learning content lives here.
   Add a new guide, challenge or question by adding an object.
   ========================================================== */

const LANGUAGES = ['JavaScript', 'Python', 'HTML', 'CSS'];
const LEVELS = ['Beginner', 'Intermediate'];

/* ---------- Coding Library ---------- */
const LIBRARY = [
  { lang:'JavaScript', level:'Beginner',     title:'Variables: let and const', text:'Use const for values that never change and let for values that do.', code:'const school = "CDKNOW";\nlet score = 0;\nscore = score + 10;' },
  { lang:'JavaScript', level:'Beginner',     title:'Arrow functions',          text:'A short way to write a function.', code:'const double = n => n * 2;\nconsole.log(double(4)); // 8' },
  { lang:'JavaScript', level:'Intermediate', title:'Array.map()',              text:'Builds a new array by changing every item.', code:'[1,2,3].map(n => n * n);\n// [1, 4, 9]' },
  { lang:'Python',     level:'Beginner',     title:'Lists and loops',          text:'Store many values and visit each one.', code:'fruits = ["apple", "mango"]\nfor f in fruits:\n    print(f)' },
  { lang:'Python',     level:'Beginner',     title:'Functions with def',       text:'Group code you want to reuse.', code:'def greet(name):\n    return "Hi, " + name' },
  { lang:'Python',     level:'Intermediate', title:'Dictionaries',             text:'Store data as key and value pairs.', code:'user = {"name": "Kent", "age": 20}\nprint(user["name"])' },
  { lang:'HTML',       level:'Beginner',     title:'Semantic layout',          text:'Use tags that describe the content.', code:'<header>...</header>\n<main>...</main>\n<footer>...</footer>' },
  { lang:'HTML',       level:'Intermediate', title:'Forms',                    text:'Collect input from the user.', code:'<form>\n  <label>Email <input type="email"></label>\n  <button>Send</button>\n</form>' },
  { lang:'CSS',        level:'Beginner',     title:'Flexbox',                  text:'Line up items in a row or column.', code:'.row {\n  display: flex;\n  gap: 1rem;\n}' },
  { lang:'CSS',        level:'Intermediate', title:'Grid',                     text:'Make two-dimensional layouts.', code:'.cards {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n}' }
];

/* ---------- Coding Area challenges ----------
   tests  : JavaScript challenges. [arguments, expected result]
   checks : Python / HTML / CSS challenges. [regex, message]
   preview: show a live preview (HTML and CSS)
   free   : playground with no checking                              */
const CHALLENGES = [
  { id:'js1', lang:'JavaScript', level:'Beginner', title:'Add two numbers',
    description:'Write a function add(a, b) that returns the sum of a and b.',
    starter:'function add(a, b) {\n  // your code here\n}',
    solution:'function add(a, b) {\n  return a + b;\n}',
    fn:'add', tests:[ [[2,3],5], [[-1,1],0], [[10,5],15] ] },

  { id:'js2', lang:'JavaScript', level:'Beginner', title:'Even or odd',
    description:'Write isEven(n) that returns true when n is even and false when it is odd.',
    starter:'function isEven(n) {\n  \n}',
    solution:'function isEven(n) {\n  return n % 2 === 0;\n}',
    fn:'isEven', tests:[ [[4],true], [[7],false], [[0],true] ] },

  { id:'js3', lang:'JavaScript', level:'Intermediate', title:'Reverse a string',
    description:'Write reverse(text) that returns the text backwards.',
    starter:'function reverse(text) {\n  \n}',
    solution:'function reverse(text) {\n  return text.split("").reverse().join("");\n}',
    fn:'reverse', tests:[ [['code'],'edoc'], [['a'],'a'] ] },

  { id:'js4', lang:'JavaScript', level:'Intermediate', title:'Sum of an array',
    description:'Write sumArray(nums) that returns the total of all numbers in the array.',
    starter:'function sumArray(nums) {\n  \n}',
    solution:'function sumArray(nums) {\n  return nums.reduce((t, n) => t + n, 0);\n}',
    fn:'sumArray', tests:[ [[[1,2,3]],6], [[[]],0] ] },

  { id:'py1', lang:'Python', level:'Beginner', title:'Say hello',
    description:'Print exactly: Hello, CDKNOW',
    starter:'# write your code below\n',
    solution:'print("Hello, CDKNOW")',
    checks:[ [/print\s*\(\s*["']Hello, CDKNOW["']\s*\)/, 'Use print() with the text Hello, CDKNOW'] ] },

  { id:'py2', lang:'Python', level:'Intermediate', title:'Square a number',
    description:'Define a function square(n) that returns n multiplied by itself.',
    starter:'def square(n):\n    \n',
    solution:'def square(n):\n    return n * n',
    checks:[ [/def\s+square\s*\(\s*n\s*\)\s*:/, 'Define def square(n):'],
             [/return\s+(n\s*\*\s*n|n\s*\*\*\s*2)/, 'Return n * n'] ] },

  { id:'html1', lang:'HTML', level:'Beginner', title:'Heading and link',
    description:'Add an h1 heading with text, and an a link that has an href.',
    starter:'<!-- Add a heading and a link -->\n',
    solution:'<h1>Hello CDKNOW</h1>\n<a href="https://example.com">Visit</a>',
    preview:true,
    checks:[ [/<h1[^>]*>[^<]+<\/h1>/i, 'Add an <h1> heading with text'],
             [/<a\s[^>]*href=["'][^"']+["']/i, 'Add an <a> link with an href'] ] },

  { id:'css1', lang:'CSS', level:'Beginner', title:'Style a box',
    description:'Style the .box with a background color, padding and rounded corners.',
    starter:'<style>\n.box {\n  \n}\n</style>\n<div class="box">I am a box</div>',
    solution:'<style>\n.box {\n  background: gold;\n  padding: 20px;\n  border-radius: 12px;\n}\n</style>\n<div class="box">I am a box</div>',
    preview:true,
    checks:[ [/\.box\s*\{[^}]*background/i, 'Set a background'],
             [/\.box\s*\{[^}]*padding/i, 'Set padding'],
             [/\.box\s*\{[^}]*border-radius/i, 'Set border-radius'] ] },

  { id:'pjs', lang:'JavaScript', level:'Free play', title:'JavaScript playground',
    description:'Experiment freely. Use console.log() to see output.',
    starter:'console.log("Hello, CDKNOW!");\n\nfor (let i = 1; i <= 3; i++) {\n  console.log("Count: " + i);\n}',
    free:true },

  { id:'phtml', lang:'HTML', level:'Free play', title:'HTML and CSS playground',
    description:'Experiment freely. Press Run to update the live preview.',
    starter:'<h1>My playground</h1>\n<p>Edit me and press Run.</p>\n<style>\n  h1 { color: royalblue; }\n</style>',
    free:true, preview:true }
];

/* ---------- Quiz questions ----------
   answer = index (starting at 0) of the correct option */
const QUIZ_BANK = [
  { lang:'JavaScript', level:'Beginner',     question:'Which symbol starts a single-line comment in JavaScript?', options:['//','#','<!--','**'], answer:0 },
  { lang:'JavaScript', level:'Beginner',     question:'What does console.log() do?', options:['Prints to the console','Saves a file','Creates a variable','Reloads the page'], answer:0 },
  { lang:'JavaScript', level:'Intermediate', question:'What does [1,2,3].length return?', options:['2','3','4','undefined'], answer:1 },
  { lang:'JavaScript', level:'Intermediate', question:'Which method turns a JSON string into an object?', options:['JSON.parse()','JSON.stringify()','Object.new()','String.json()'], answer:0 },
  { lang:'Python', level:'Beginner',     question:'How do you start a comment in Python?', options:['//','#','/*','--'], answer:1 },
  { lang:'Python', level:'Beginner',     question:'Which of these is a Python list?', options:['{1, 2}','(1, 2)','[1, 2]','<1, 2>'], answer:2 },
  { lang:'Python', level:'Intermediate', question:'What does len("code") return?', options:['3','4','5','Error'], answer:1 },
  { lang:'Python', level:'Intermediate', question:'Which keyword handles errors?', options:['catch','except','rescue','handle'], answer:1 },
  { lang:'HTML', level:'Beginner',     question:'Which tag creates a link?', options:['<link>','<a>','<href>','<url>'], answer:1 },
  { lang:'HTML', level:'Beginner',     question:'Which tag holds the main page title shown in the browser tab?', options:['<h1>','<head>','<title>','<top>'], answer:2 },
  { lang:'HTML', level:'Intermediate', question:'Which attribute gives an image alternative text?', options:['title','alt','src','name'], answer:1 },
  { lang:'HTML', level:'Intermediate', question:'Which tag is best for site navigation links?', options:['<nav>','<menu>','<div>','<section>'], answer:0 },
  { lang:'CSS', level:'Beginner',     question:'Which property sets the background color?', options:['bgcolor','background-color','color-bg','fill'], answer:1 },
  { lang:'CSS', level:'Beginner',     question:'Which selector targets a class named card?', options:['#card','card','.card','*card'], answer:2 },
  { lang:'CSS', level:'Intermediate', question:'What does position: sticky do?', options:['Fixes the element forever','Sticks it while scrolling in its container','Hides it','Floats it right'], answer:1 },
  { lang:'CSS', level:'Intermediate', question:'Which unit is relative to the root font size?', options:['px','em','rem','pt'], answer:2 }
];