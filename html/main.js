const $ = (selector) => document.querySelector(selector);
google.charts.load('current', {packages: ['corechart', 'line']});

function drawLineStyles() {
      var data = new google.visualization.DataTable();
      data.addColumn('date', 'expenseDate');
      data.addColumn('number', 'Balance');
	  data.addColumn({type: 'string', role: 'tooltip'});
	  data.addColumn({type: 'string', role: 'style'});

    //   data.addRows([
	// 	[new Date("January 31 1980"),5, 'income 5'],[new Date("January 20 1995"),10, 'income 5'], [new Date("March 10 2012"),40, 'income 30'], [new Date(),400, 'income 360']
	//   ]);

	data.addRows(valuesArray);
	  
      var options = {
	    //dataOpacity: 0.7,
		legend: {position: 'none'},
		backgroundColor: {
			fill:'#6473c9'
		},
		hAxis: {
			titleTextStyle : {color: '#ffffff'},
			textStyle : {color: '#ffffff'},
			title: 'Date',
			format: 'MMM dd',
			ticks: datesArray,
			gridlines: {
				color: 'none',
				count: 0
			}
		},
        vAxis: {
		  titleTextStyle : {color: '#ffffff'},
		  textStyle : {color: '#ffffff'},
          title: 'Balance',
		  ticks: balancesArray,
		  gridlines: {
				color: '#303f9f',
				count: 1
			}
		},
		animation: {
			startup: true,
			duration: 1500,
			easing: 'out'
		},
        colors: ['#ffffff'],
        series: {
          0: {
            lineWidth: 2
          }
        }
      };

      var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
	  chart.draw(data, options);
	}

let fetchedExpenses;
let balance = new Number();
let newDateGMT = new Date();
let GMTDiff = newDateGMT.getTimezoneOffset() * 60000;

// var url = window.location ? window.location : window.location.search;
// console.log(url);

function getParameter(parameterName) {
    var result = null, tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

// console.log(findGetParameter('user'));

async function verifyLogged(){
	let un = getParameter('user');
	let chid = getParameter('chid');
	// console.log('user: '+un);
	// console.log('chid: '+chid);
	if (un != null && chid != null && un != '' && chid != ''){
		await fetch(`https://expensebot.mywebsite.com:1880/verify/${un}/${chid}`)
		.then(function(response) {
			return response.json();
		})
		.then(function(fetched) {
			//console.log('fetched: ',fetched);
			if(!fetched[0]){
				window.location.replace('login.html');
			} else{
				getExpenses(un);
			}
		});
	} else {
		window.location.replace('login.html');
	}
}

async function getExpenses(username){
	await fetch(`https://expensebot.mywebsite.com:1880/view/${username}`)
	.then(function(response) {
		return response.json();
	})
	.then(function(fetched) {
		//console.log(fetched);
		fetchedExpenses = fetched[1];
		listExpenses(fetchedExpenses);
		changeListener();
	});
}

var valuesArray=[], balancesArray=[0], datesArray=[];
var pointStyle = 'point {shape-type: circle; size: 8; stroke-width: 3; visible: true; fill-color: #303f9f; stroke-color: #ffffff;}';

function listExpenses(exps){
	balance = 0;
	valuesArray=[];
	balancesArray=[0];
	datesArray=[];
	exps.forEach( exp => {
		let thisValuesArray=[];
		exp.exp_val = new Number(exp.exp_val);
		balance = balance - exp.exp_val;
		balancesArray.push(balance);
		exp.exp_date = new Date(exp.exp_date);
		exp.exp_date = new Date(exp.exp_date.valueOf() - GMTDiff);
		exp.exp_date.setSeconds(0,0);
		thisValuesArray.push(exp.exp_date);
		datesArray.push(exp.exp_date);
		thisValuesArray.push(balance);
		let newExp = document.createElement('li');
		if(exp.exp_val < 0){
			newExp.classList.add('income');
			exp.exp_val = new Number(-exp.exp_val);
			thisValuesArray.push(exp.exp_tag+' +€'+exp.exp_val);
		} else {
			thisValuesArray.push(exp.exp_tag+' -€'+exp.exp_val);
		}
		thisValuesArray.push(pointStyle);
		valuesArray.push(thisValuesArray);
		newExp.dataset.expId = exp.exp_id;
		newExp.innerHTML = '€<input type="number" value="'+exp.exp_val+'" placeholder="'+exp.exp_val+'"/> - <input type="text" value="'+exp.exp_tag+'" placeholder="'+exp.exp_tag+'"/> - <input type="datetime-local" value="'+exp.exp_date.toISOString().split(".")[0]+'"/>';
		$('ul').insertBefore(newExp, $('ul').firstChild);
	});
	$('.balance>code').innerHTML = ' € '+balance;
	//console.log('valuesArray: ',valuesArray, '; balancesArray: ',balancesArray);
}

$('.chart-button').addEventListener('click', function(){
	google.charts.setOnLoadCallback(drawLineStyles);
});

function changeListener(){
	document.querySelectorAll('input').forEach(expInput => {
		expInput.addEventListener('focusout', function(){submitUpdate(expInput)});
		expInput.addEventListener('keypress', function (e) {
			var key = e.which || e.keyCode;
			if (key === 13) {
				expInput.blur();
			}
		});
	});
}

function submitUpdate(input){
	let inputId = input.parentElement.dataset.expId;
	let inputVal = input.parentElement.childNodes[1].value;
	let inputTag= input.parentElement.childNodes[3].value;
	let inputDate = input.parentElement.childNodes[5].value;
	if(inputVal==''){
		fetchedExpenses.forEach( exp => {
			if(exp.exp_id==inputId){inputVal=exp.exp_val}
		});
	}
	if(inputTag==''){
		fetchedExpenses.forEach( exp => {
			if(exp.exp_id==inputId){inputTag=exp.exp_tag}
		});
	}
	if(inputDate==''){
		fetchedExpenses.forEach( exp => {
			if(exp.exp_id==inputId){inputDate=exp.exp_date}
		});
	}
	if(input.parentElement.classList.contains('income')){
		inputVal = -inputVal;
	}
	fetch('https://expensebot.mywebsite.com:1880/update/'+inputId+'/'+inputVal+'/'+inputTag+'/'+inputDate)
	.then(function(response) {
		return response.json();
	})
	.then(function(fetched) {
		let un = getParameter('user');
		//console.log(fetched);
		$('ul').innerHTML = '';
		getExpenses(un)
		.then(function(){
			$('li[data-exp-id="'+inputId+'"]').classList.add('changed-exp');
			setTimeout(function(){$('li[data-exp-id="'+inputId+'"]').classList.remove('changed-exp')}, 550);
		});
	});
}

verifyLogged();
