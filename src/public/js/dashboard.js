//const { response } = require("express")




/* jQuery */
$(document).ready(function(){
    /* Privilege */
    var role = $('#role').text()
    if((isRole(role,'viewer')|isRole(role,'controller'))){
        $('.sidebar-menu ul li a').each(function(index, value) {
            if(($(this).attr('href') === '/user/manage')){
                $(this).removeAttr('href')
            }
        })
    }
    else if(isRole(role,'admin')) {
        $('.sidebar-menu ul li a').each(function(index, value) {
            if(!($(this).attr('href') === '/user/manage')){
                $(this).removeAttr('href')
            }
        }) 
    }
    var page = $('header h4 div')

    /* Dashboard */
    if(page.text() === 'Dashboard')
    {   
        var socket = io('http://localhost:8000')

        /* Variable */
        var V1N =  $('.cards .card-single .card-1 p')
        var V2N =  $('.cards .card-single .card-2 p')
        var V3N =  $('.cards .card-single .card-3 p')
        var VLN =  $('.cards .card-single .card-0 p')
        var currentPlot = document.getElementById('currentPlot')
        var KWH = $('#energy')
        var freq = $('#freq')
        var KW0 = $('#kw-sum')
        var KW1 = $('#kw-phase-one')
        var KW2 = $('#kw-phase-two')
        var KW3 = $('#kw-phase-three')
        var KVA0 = $('#kva-sum')
        var KVA1 = $('#kva-phase-one')
        var KVA2 = $('#kva-phase-two')
        var KVA3 = $('#kva-phase-three')
        var KVAR0 = $('#kvar-sum')
        var KVAR1 = $('#kvar-phase-one')
        var KVAR2 = $('#kvar-phase-two')
        var KVAR3 = $('#kvar-phase-three')
        var PF0 = $('#pf-sum')
        var PF1 = $('#pf-phase-one')
        var PF2 = $('#pf-phase-two')
        var PF3 = $('#pf-phase-three')        

        /* sparkline */
        var optionsVol = {
            height: '70px',
            lineColor: '#1D6A96',
            highlightLineColor: '#1D6A96',
            minSpotColor: '',
            maxSpotColor: '',
            spotColor: '',
            lineWidth: 2,
            chartRangeMin: 0,
            chartRangeMax: 400,
            defaultPixelsPerValue: 10,
        }
        if(!localStorage.getItem('V1N')){
            localStorage.setItem('V1N',JSON.stringify([0,0,0,0,0,0,0,0,0,0,0,0,0,0]))
            localStorage.setItem('V2N',JSON.stringify([0,0,0,0,0,0,0,0,0,0,0,0,0,0]))
            localStorage.setItem('V3N',JSON.stringify([0,0,0,0,0,0,0,0,0,0,0,0,0,0]))
            localStorage.setItem('VLN',JSON.stringify([0,0,0,0,0,0,0,0,0,0,0,0,0,0]))
        }
        $('#sparkline-V1N').sparkline(JSON.parse(localStorage.getItem('V1N')), optionsVol)
        $('#sparkline-V2N').sparkline(JSON.parse(localStorage.getItem('V2N')), optionsVol)
        $('#sparkline-V3N').sparkline(JSON.parse(localStorage.getItem('V3N')), optionsVol)
        $('#sparkline-VLN').sparkline(JSON.parse(localStorage.getItem('VLN')), optionsVol)

        /* relay status indicator */
            /* relay A */
        var switchRelayA = $('#swich-num-1')
        var onStatusRelayA = $('#do-on-1')
        var offStatusRelayA = $('#do-off-1')
            /* relay B */
        var switchRelayB = $('#swich-num-2')
        var onStatusRelayB = $('#do-on-2')
        var offStatusRelayB = $('#do-off-2')
            /* relay C */
        var switchRelayC = $('#swich-num-3')
        var onStatusRelayC = $('#do-on-3')
        var offStatusRelayC = $('#do-off-3')
            /* relay D */
        var switchRelayD = $('#swich-num-4')
        var onStatusRelayD = $('#do-on-4')
        var offStatusRelayD = $('#do-off-4')
            /* relay D */
        var onSensorA = $('#di-on-1')
        var offSensorA = $('#di-off-1')
            /* relay D */
        var onSensorB = $('#di-on-2')
        var offSensorB = $('#di-off-2')


        /* Init Current Plot */    

        var currentLine1 = {
            y:[0],
            type: 'line',
            name: 'Current Phase 1',
        }

        var currentLine2 = {
            y:[0],
            type: 'line',
            name: 'Current Phase 2',
        }

        var currentLine3 = {
            y:[0],
            type: 'line',
            name: 'Current Phase 3',
        }

        var data = [currentLine1, currentLine2, currentLine3]

        var layout = {
            title: 'Cabinet Current',
            width: 700,
            xaxis: {
                title: 'Time',
                showgrid: false,
                zeroline: false
            },
            yaxis: {
            title: 'Ampe(A)',
            showline: false
            }
        }
        var config = {
                    scrollZoom: true,
                    toImageButtonOptions: {
                                            format: 'png',
                                            filename: 'CabinetCurrent',
                                            height: 500,
                                            width: 700,
                                            scale: 1
                                        },
                    displaylogo: false,
                    }
        Plotly.plot(currentPlot, data, layout, config)

        /* Make a connection */
        var deviceName = $('main .device-connection #device-name')
        var stateDevice = $('main .device-connection .status-device h3:last-child')
        var enableRequest = false
        socket.emit('connection-setting',{
            deviceName: deviceName.text()
        })
        socket.on('connection-setting', (data) => {
                stateDevice.text(data.state)
                stateDevice.css('color','green')
                enableRequest = data.triggerRequest
        })

        /* Privilege */
        if(isRole(role,'viewer')){
            switchRelayA.attr('disabled',true)
            switchRelayB.attr('disabled',true)
            switchRelayC.attr('disabled',true)
            switchRelayD.attr('disabled',true)
        }
        
        /* Control And Supervise DO */
        switchRelayA.change(() => {
            if(switchRelayA.is(':checked')){   
                socket.emit('relay-control','ON1')   
            }
            else if(!switchRelayA.is(':checked')) {
                socket.emit('relay-control','OFF1')
            }
        })

        switchRelayB.change(() => {
            if(switchRelayB.is(':checked')){  
                socket.emit('relay-control','ON2') 
            }
            else if(!switchRelayB.is(':checked')) {
                socket.emit('relay-control','OFF2')  
            }
        })

        switchRelayC.change(() => {
            if(switchRelayC.is(':checked')){  
                socket.emit('relay-control','OFF3')
            }
            else if(!switchRelayC.is(':checked')) {
                socket.emit('relay-control','ON3')   
            }
        })

        switchRelayD.change(() => {
            if(switchRelayD.is(':checked')){  
                socket.emit('relay-control','OFF4')
            }
            else if(!switchRelayD.is(':checked')) {
                socket.emit('relay-control','ON4')   
            }
        })


        /* Var check time update data */
        var checkTime = Date.now()
        /* Query data socket */
        setInterval(function() {
            if(enableRequest){
                socket.emit('request-mqtt-data',{
                    deviceName: deviceName.text()
                })
                if((Date.now()-checkTime)>=10000){
                    stateDevice.text('DEVICE NOT FOUND')
                    stateDevice.css('color','red')
                }
            }
        }, 1000)

        /* Vol socket */
        socket.on('response-mqtt-data', (data) => {
            /*Indicator*/
            // console.log(data)

            /* Update time check */
            checkTime = Date.now()

            if(data.V1N) {
                /* Add to attribute vol */
                V1N.text(Math.round(data.V1N))
                /* Sparkline Update */
                var sV1N = JSON.parse(localStorage.getItem('V1N'))
                localStorage.setItem('V1N',JSON.stringify(updateSparkline(sV1N,data.V1N)))
                $('#sparkline-V1N').sparkline(updateSparkline(sV1N,data.V1N), optionsVol)
                /* Freqency and Energy */
                freq.text(data.freq)
                /* Active Power */
                KW1.text(data.KW1)
                /* Reactive Power */
                KVA1.text(data.KVA1)
                /* Apparent Power */
                KVAR1.text(data.KVAR1)
                /* Power Factor */
                PF1.text(data.PF1)
                /* Plot current */
                Plotly.extendTraces(currentPlot, {y: [[data.I1],[data.I2],[data.I3]] }, [0,1,2])

                V2N.text(Math.round(data.V2N))
                /* */
                var sV2N = JSON.parse(localStorage.getItem('V2N'))
                localStorage.setItem('V2N',JSON.stringify(updateSparkline(sV2N,data.V2N)))
                $('#sparkline-V2N').sparkline(updateSparkline(sV2N,data.V2N), optionsVol)
                /* */
                KWH.text(data.KWH)
                KW2.text(data.KW2)
                KVA2.text(data.KVA2)
                KVAR2.text(data.KVAR2)
                PF2.text(data.PF2)

                V3N.text(Math.round(data.V3N))
                /* */
                var sV3N = JSON.parse(localStorage.getItem('V3N'))
                localStorage.setItem('V3N',JSON.stringify(updateSparkline(sV3N,data.V3N)))
                $('#sparkline-V3N').sparkline(updateSparkline(sV3N,data.V3N), optionsVol)
                /* */
                KW3.text(data.KW3)
                KVA3.text(data.KVA3)
                KVAR3.text(data.KVAR3)
                PF3.text(data.PF3)

                VLN.text(Math.round(data.VLN))
                /* */
                var sVLN = JSON.parse(localStorage.getItem('VLN'))
                localStorage.setItem('VLN',JSON.stringify(updateSparkline(sVLN,data.VLN)))
                $('#sparkline-VLN').sparkline(updateSparkline(sVLN,data.VLN), optionsVol)
                KW0.text(data.KW0)
                KVA0.text(data.KVA0)
                KVAR0.text(data.KVAR0)
                PF0.text(data.PF0)
            }
            else if(data.V2N){
                V2N.text(Math.round(data.V2N))
                /* */
                var sV2N = JSON.parse(localStorage.getItem('V2N'))
                localStorage.setItem('V2N',JSON.stringify(updateSparkline(sV2N,data.V2N)))
                $('#sparkline-V2N').sparkline(updateSparkline(sV2N,data.V2N), optionsVol)
                /* */
                KWH.text(data.KWH)
                KW2.text(data.KW2)
                KVA2.text(data.KVA2)
                KVAR2.text(data.KVAR2)
                PF2.text(data.PF2)
            }
            else if(data.V3N){                
                V3N.text(Math.round(data.V3N))
                /* */
                var sV3N = JSON.parse(localStorage.getItem('V3N'))
                localStorage.setItem('V3N',JSON.stringify(updateSparkline(sV3N,data.V3N)))
                $('#sparkline-V3N').sparkline(updateSparkline(sV3N,data.V3N), optionsVol)
                /* */
                Plotly.extendTraces(currentPlot, {y: [[data.I3]] }, [2])
                KW3.text(data.KW3)
                KVA3.text(data.KVA3)
                KVAR3.text(data.KVAR3)
                PF3.text(data.PF3)
            }
            else if (data.VLN){
                VLN.text(Math.round(data.VLN))
                /* */
                var sVLN = JSON.parse(localStorage.getItem('VLN'))
                localStorage.setItem('VLN',JSON.stringify(updateSparkline(sVLN,data.VLN)))
                $('#sparkline-VLN').sparkline(updateSparkline(sVLN,data.VLN), optionsVol)
                KW0.text(data.KW0)
                KVA0.text(data.KVA0)
                KVAR0.text(data.KVAR0)
                PF0.text(data.PF0)
            }
            else if (data.DI0) {
                if(parseInt(data.DI0)) {
                    onSensorA.css('display','inline-block')
                    offSensorA.css('display','none')
                    $('#di-loader-0').css('display','none')
                }
                else{
                    onSensorA.css('display','none')
                    offSensorA.css('display','inline-block')
                    $('#di-loader-0').css('display','none')
                }
                if(parseInt(data.DI1)) {
                    onSensorB.css('display','inline-block')
                    offSensorB.css('display','none')
                    $('#di-loader-1').css('display','none')
                }
                else{
                    onSensorB.css('display','none')
                    offSensorB.css('display','inline-block')
                    $('#di-loader-1').css('display','none')
                }
                if(parseInt(data.DO0)) {
                    onStatusRelayA.css('display','inline-block')
                    offStatusRelayA.css('display','none')
                    $('#do-loader-0').css('display','none')
                    switchRelayA.prop('checked',true)
                }
                else{
                    onStatusRelayA.css('display','none')
                    offStatusRelayA.css('display','inline-block')
                    $('#do-loader-0').css('display','none')
                    switchRelayA.prop('checked',false)
                }
                if(parseInt(data.DO1)) {
                    onStatusRelayB.css('display','inline-block')
                    offStatusRelayB.css('display','none')
                    $('#do-loader-1').css('display','none')
                    switchRelayB.prop('checked',true)
                }
                else{
                    onStatusRelayB.css('display','none')
                    offStatusRelayB.css('display','inline-block')
                    $('#do-loader-1').css('display','none')
                    switchRelayB.prop('checked',false)
                }
            }
        })
        /* Real-time clock */
        var realTimeClock = $('main .device-connection div:last-child h4')
        setInterval(function(){
            var now = new Date()
            realTimeClock.text(getClockTime(now))
        },1000)

        /* Check Nav */
        $('#nav-toggle').click(function() {
            isCheckNav = $('#nav-toggle').is(':checked')
            if(isCheckNav) {
                Plotly.relayout(currentPlot,{width: 900})
            }
            else {
                Plotly.relayout(currentPlot,{width: 700})
            }
        })
    }
    /* ALarms */
    else if(page.text() === 'Alarms'){
        /* Privilege */
        if(isRole(role,'viewer')){
            $('.alarm-management li a').each(function(index, value) {
                if(!($(this).attr('href') === '/user/alarms')){
                    $(this).removeAttr('href')
                }
            })
        }

        /* Pagination */
        var alarmPagination = $('.digital-alarm-pagination')

        /* Initialize */
        alarmPagination.html(
            "<li id=\"da-pagination-1\" class=\"page-item disabled\"><a class=\"page-link\" data-page=0>Previous</a></li>"+
            "<li id=\"da-pagination-2\" class=\"page-item active\"><a class=\"page-link\" data-page=1\">1</a></li>"+
            "<li id=\"da-pagination-3\" class=\"page-item\"><a class=\"page-link\" data-page=2\">2<span class=\"sr-only\">(current)</span></a></li>"+
            "<li id=\"da-pagination-4\" class=\"page-item\"><a class=\"page-link\" data-page=3\">3</a></li>"+
            "<li id=\"da-pagination-5\" class=\"page-item\"><a class=\"page-link\" data-page=4\">Next</a></li>"
        )

        var tdDataDA = $('#digital-alarm tbody tr td')
        var thDataDA = $('#digital-alarm tbody tr th')
        var liFetchDA = $('.digital-alarm-pagination li')
        /* Pagination li */
        var idPagi1DA = $('#da-pagination-1')
        var idPagi2DA = $('#da-pagination-2')
        var idPagi3DA = $('#da-pagination-3')
        var idPagi4DA = $('#da-pagination-4')
        var idPagi5DA = $('#da-pagination-5')
        var maxPageDA = parseInt(alarmPagination.attr('data-maxpage'))

        /* Filter */
        var digitalAlarmFilterTag = $('#digitalAlarmFilter')
        var valueOfFilterDA = 'All'
        liFetchDA.on('click',function(e){
            if(!($(this).attr('class')==='page-item disabled')){
                var pageNowDA = parseInt(e.target.dataset.page)     
                var dataAPI = 'http://localhost:8000/user/alarms/digital-data?pageDA='+pageNowDA+'&filter='+valueOfFilterDA
                fetch(dataAPI)
                    .then((response)=> {
                        return response.json()
                    })
                    .then((data) => {
                        data.shift()
                        var index = 0
                        var ordStart = pageNowDA*5-4
                        for(var j = 0; j<data.length;j++){
                            /* Set Ord */
                            thDataDA[j].innerText = ordStart++
                            /* */
                            for(var digitalAlert in data[j]){
                                tdDataDA[index].innerText = data[j][digitalAlert].toString()
                                index++
                            }
                        }

                        /* fix bug not full */
                        if(data.length<5){
                            var ord = data.length*4 //number of col
                            for(var i = data.length; i < 5; i++){
                                thDataDA[i].innerText = 'null'
                                for(var j = 0; j<4; j++){
                                    tdDataDA[ord].innerText = 'null'
                                    ord++
                                }
                            }
                        }

                        /* */
                        if(pageNowDA === 1){
                            idPagi1DA.attr('class','page-item disabled')
                            /**/
                            idPagi2DA.attr('class','page-item active')
                            idPagi2DA.html('<a class=\"page-link\" data-page='+pageNowDA+'>'+pageNowDA+'<span class=\"sr-only\">(current)</span></a>')
                            /* */
                            idPagi3DA.attr('class','page-item')
                            idPagi3DA.html('<a class=\"page-link\" data-page='+(pageNowDA+1)+'>'+(pageNowDA+1)+'</a>')
                            /* */
                            idPagi4DA.attr('class','page-item')
                            idPagi4DA.html('<a class=\"page-link\" data-page='+(pageNowDA+2)+'>'+(pageNowDA+2)+'</a>')
                            /* */
                            idPagi5DA.attr('class','page-item')
                            idPagi5DA.html('<a class=\"page-link\" data-page='+(pageNowDA+3)+'>Next</a>')
                        }
                        else if(pageNowDA === 2){
                            idPagi1DA.attr('class','page-item disabled')
                            /**/
                            idPagi2DA.attr('class','page-item')
                            idPagi2DA.html('<a class=\"page-link\" data-page='+(pageNowDA-1)+'>'+(pageNowDA-1)+'</a>')
                            /* */
                            idPagi3DA.attr('class','page-item active')
                            idPagi3DA.html('<a class=\"page-link\" data-page='+pageNowDA+'>'+pageNowDA+'<span class=\"sr-only\">(current)</span></a>')
                            /* */
                            idPagi4DA.attr('class','page-item')
                            idPagi4DA.html('<a class=\"page-link\" data-page='+(pageNowDA+1)+'>'+(pageNowDA+1)+'</a>')
                            /* */
                            idPagi5DA.attr('class','page-item')
                            idPagi5DA.html('<a class=\"page-link\" data-page='+(pageNowDA+2)+'>Next</a>')
                        }
                        else if(pageNowDA===(maxPageDA-1)){
                            idPagi1DA.attr('class','page-item')
                            idPagi1DA.html('<a class=\"page-link\" data-page='+(pageNowDA-2)+'>Previous</a>')
                            /**/
                            idPagi2DA.attr('class','page-item')
                            idPagi2DA.html('<a class=\"page-link\" data-page='+(pageNowDA-1)+'>'+(pageNowDA-1)+'</a>')
                            /* */
                            idPagi3DA.attr('class','page-item active')
                            idPagi3DA.html('<a class=\"page-link\" data-page='+pageNowDA+'>'+pageNowDA+'<span class=\"sr-only\">(current)</span></a>')
                            /* */
                            idPagi4DA.attr('class','page-item')
                            idPagi4DA.html('<a class=\"page-link\" data-page='+(pageNowDA+1)+'>'+(pageNowDA+1)+'</a>')
                            /* */
                            idPagi5DA.attr('class','page-item disabled')
                        }
                        else if(pageNowDA===maxPageDA){
                            idPagi1DA.attr('class','page-item')
                            idPagi1DA.html('<a class=\"page-link\" data-page='+(pageNowDA-3)+'>Previous</a>')
                            /**/
                            idPagi2DA.attr('class','page-item')
                            idPagi2DA.html('<a class=\"page-link\" data-page='+(pageNowDA-2)+'>'+(pageNowDA-2)+'</a>')
                            /* */
                            idPagi3DA.attr('class','page-item')
                            idPagi3DA.html('<a class=\"page-link\" data-page='+(pageNowDA-1)+'>'+(pageNowDA-1)+'</a>')
                            /* */
                            idPagi4DA.attr('class','page-item active')
                            idPagi4DA.html('<a class=\"page-link\" data-page='+pageNowDA+'>'+pageNowDA+'<span class=\"sr-only\">(current)</span></a>')
                            /* */
                            idPagi5DA.attr('class','page-item disabled')
                        }
                        else{
                            idPagi1DA.attr('class','page-item')
                            idPagi1DA.html('<a class=\"page-link\" data-page='+(pageNowDA-2)+'>Previous</a>')
                            /**/
                            idPagi2DA.attr('class','page-item')
                            idPagi2DA.html('<a class=\"page-link\" data-page='+(pageNowDA-1)+'>'+(pageNowDA-1)+'</a>')
                            /* */
                            idPagi3DA.attr('class','page-item active')
                            idPagi3DA.html('<a class=\"page-link\" data-page='+pageNowDA+'>'+pageNowDA+'<span class=\"sr-only\">(current)</span></a>')

                            /* */
                            idPagi4DA.attr('class','page-item')
                            idPagi4DA.html('<a class=\"page-link\" data-page='+(pageNowDA+1)+'>'+(pageNowDA+1)+'</a>')

                            /* */
                            idPagi5DA.attr('class','page-item')
                            idPagi5DA.html('<a class=\"page-link\" data-page='+(pageNowDA+2)+'>Next</a>')

                        }
                    })
                .catch(err =>{console.log(err)}
                )
            }
        })

        digitalAlarmFilterTag.on('change', function(){
            valueOfFilterDA=this.value
            digitalFilterAPI = 'http://localhost:8000/user/alarms/digital-data?filter='+valueOfFilterDA
            fetch(digitalFilterAPI)
                .then((response) =>{
                    return response.json()
                })
                .then((data) => {
                    maxPageDA = data.shift()
                    var index = 0
                    var ordStart = 1
                    for(var j = 0; j<data.length;j++){
                        /* Set Ord */
                        thDataDA[j].innerText = ordStart++
                        /* */
                        for(var digitalAlert in data[j]){
                            tdDataDA[index].innerText = data[j][digitalAlert].toString()
                            index++
                        }
                    }

                    /* fix bug not full */
                    if(data.length<5){
                        var ord = data.length*4 //number of col
                        for(var i = data.length; i < 5; i++){
                            thDataDA[i].innerText = 'null'
                            for(var j = 0; j<4; j++){
                                tdDataDA[ord].innerText = 'null'
                                ord++
                            }
                        }
                    }
                    /* Re-initialize*/
                    idPagi1DA.attr('class','page-item disabled')
                    /**/
                    idPagi2DA.attr('class','page-item active')
                    idPagi2DA.html('<a class=\"page-link\" data-page=1>1<span class=\"sr-only\">(current)</span></a>')
                    /* */
                    idPagi3DA.attr('class','page-item')
                    idPagi3DA.html('<a class=\"page-link\" data-page=2>2</a>')
                    /* */
                    idPagi4DA.attr('class','page-item')
                    idPagi4DA.html('<a class=\"page-link\" data-page=3>3</a>')
                    /* */
                    idPagi5DA.attr('class','page-item')
                    idPagi5DA.html('<a class=\"page-link\" data-page=4>Next</a>')
                })
        })
        /* Analog */
        var analogAlarmPagination = $('.analog-alarm-pagination')
        analogAlarmPagination.html(
            "<li id=\"aa-pagination-1\" class=\"page-item disabled\"><a class=\"page-link\" data-page=0>Previous</a></li>"+
            "<li id=\"aa-pagination-2\" class=\"page-item active\"><a class=\"page-link\" data-page=1\">1</a></li>"+
            "<li id=\"aa-pagination-3\" class=\"page-item\"><a class=\"page-link\" data-page=2\">2<span class=\"sr-only\">(current)</span></a></li>"+
            "<li id=\"aa-pagination-4\" class=\"page-item\"><a class=\"page-link\" data-page=3\">3</a></li>"+
            "<li id=\"aa-pagination-5\" class=\"page-item\"><a class=\"page-link\" data-page=4\">Next</a></li>"
        )
        var tdDataAA = $('#analog-alarm tbody tr td')
        var thDataAA = $('#analog-alarm tbody tr th')
        var liFetchAA = $('.analog-alarm-pagination li')
        /* Pagination li */
        var idPagi1AA = $('#aa-pagination-1')
        var idPagi2AA = $('#aa-pagination-2')
        var idPagi3AA = $('#aa-pagination-3')
        var idPagi4AA = $('#aa-pagination-4')
        var idPagi5AA = $('#aa-pagination-5')
        var maxPageAA = parseInt(analogAlarmPagination.attr('data-maxpage'))

        /* Filter */
        var analogAlarmFilterTag = $('#analogAlarmFilter')
        var valueOfFilterAA = 'All'
        liFetchAA.on('click',function(e){
            if(!($(this).attr('class')==='page-item disabled')){
                var pageNowAA = parseInt(e.target.dataset.page)     
                var dataAPI = 'http://localhost:8000/user/alarms/analog-data?pageAA='+pageNowAA+'&filter='+valueOfFilterAA
                fetch(dataAPI)
                    .then((response)=> {
                        return response.json()
                    })
                    .then((data) => {
                        data.shift()
                        var index = 0
                        var ordStart = pageNowAA*5-4
                        for(var j = 0; j<data.length;j++){
                            /* Set Ord */
                            thDataAA[j].innerText = ordStart++
                            /* */
                            for(var analogAlert in data[j]){
                                tdDataAA[index].innerText = data[j][analogAlert].toString()
                                index++
                            }
                            /* bug ack */
                            tdDataAA[index].innerText = ''
                            index++
                        }

                        /* fix bug not full */
                        if(data.length<5){
                            var ord = data.length*6 //number of col
                            for(var i = data.length; i < 5; i++){
                                thDataAA[i].innerText = 'null'
                                for(var j = 0; j<5; j++){
                                    tdDataAA[ord].innerText = 'null'
                                    ord++
                                }
                                tdDataAA[ord].innerText = ''
                                ord++
                            }
                        }

                        if(pageNowAA === 1){
                            idPagi1AA.attr('class','page-item disabled')
                            /**/
                            idPagi2AA.attr('class','page-item active')
                            idPagi2AA.html('<a class=\"page-link\" data-page='+pageNowAA+'>'+pageNowAA+'<span class=\"sr-only\">(current)</span></a>')
                            /* */
                            idPagi3AA.attr('class','page-item')
                            idPagi3AA.html('<a class=\"page-link\" data-page='+(pageNowAA+1)+'>'+(pageNowAA+1)+'</a>')
                            /* */
                            idPagi4AA.attr('class','page-item')
                            idPagi4AA.html('<a class=\"page-link\" data-page='+(pageNowAA+2)+'>'+(pageNowAA+2)+'</a>')
                            /* */
                            idPagi5AA.attr('class','page-item')
                            idPagi5AA.html('<a class=\"page-link\" data-page='+(pageNowAA+3)+'>Next</a>')
                        }
                        else if(pageNowAA === 2){
                            idPagi1AA.attr('class','page-item disabled')
                            /**/
                            idPagi2AA.attr('class','page-item')
                            idPagi2AA.html('<a class=\"page-link\" data-page='+(pageNowAA-1)+'>'+(pageNowAA-1)+'</a>')
                            /* */
                            idPagi3AA.attr('class','page-item active')
                            idPagi3AA.html('<a class=\"page-link\" data-page='+pageNowAA+'>'+pageNowAA+'<span class=\"sr-only\">(current)</span></a>')
                            /* */
                            idPagi4AA.attr('class','page-item')
                            idPagi4AA.html('<a class=\"page-link\" data-page='+(pageNowAA+1)+'>'+(pageNowAA+1)+'</a>')
                            /* */
                            idPagi5AA.attr('class','page-item')
                            idPagi5AA.html('<a class=\"page-link\" data-page='+(pageNowAA+2)+'>Next</a>')
                        }
                        else if(pageNowAA===(maxPageAA-1)){
                            idPagi1AA.attr('class','page-item')
                            idPagi1AA.html('<a class=\"page-link\" data-page='+(pageNowAA-2)+'>Previous</a>')
                            /**/
                            idPagi2AA.attr('class','page-item')
                            idPagi2AA.html('<a class=\"page-link\" data-page='+(pageNowAA-1)+'>'+(pageNowAA-1)+'</a>')
                            /* */
                            idPagi3AA.attr('class','page-item active')
                            idPagi3AA.html('<a class=\"page-link\" data-page='+pageNowAA+'>'+pageNowAA+'<span class=\"sr-only\">(current)</span></a>')
                            /* */
                            idPagi4AA.attr('class','page-item')
                            idPagi4AA.html('<a class=\"page-link\" data-page='+(pageNowAA+1)+'>'+(pageNowAA+1)+'</a>')
                            /* */
                            idPagi5AA.attr('class','page-item disabled')
                        }
                        else if(pageNowAA===maxPageAA){
                            idPagi1AA.attr('class','page-item')
                            idPagi1AA.html('<a class=\"page-link\" data-page='+(pageNowAA-3)+'>Previous</a>')
                            /**/
                            idPagi2AA.attr('class','page-item')
                            idPagi2AA.html('<a class=\"page-link\" data-page='+(pageNowAA-2)+'>'+(pageNowAA-2)+'</a>')
                            /* */
                            idPagi3AA.attr('class','page-item')
                            idPagi3AA.html('<a class=\"page-link\" data-page='+(pageNowAA-1)+'>'+(pageNowAA-1)+'</a>')
                            /* */
                            idPagi4AA.attr('class','page-item active')
                            idPagi4AA.html('<a class=\"page-link\" data-page='+pageNowAA+'>'+pageNowAA+'<span class=\"sr-only\">(current)</span></a>')
                            /* */
                            idPagi5AA.attr('class','page-item disabled')
                        }
                        else{
                            idPagi1AA.attr('class','page-item')
                            idPagi1AA.html('<a class=\"page-link\" data-page='+(pageNowAA-2)+'>Previous</a>')
                            /**/
                            idPagi2AA.attr('class','page-item')
                            idPagi2AA.html('<a class=\"page-link\" data-page='+(pageNowAA-1)+'>'+(pageNowAA-1)+'</a>')
                            /* */
                            idPagi3AA.attr('class','page-item active')
                            idPagi3AA.html('<a class=\"page-link\" data-page='+pageNowAA+'>'+pageNowAA+'<span class=\"sr-only\">(current)</span></a>')

                            /* */
                            idPagi4AA.attr('class','page-item')
                            idPagi4AA.html('<a class=\"page-link\" data-page='+(pageNowAA+1)+'>'+(pageNowAA+1)+'</a>')

                            /* */
                            idPagi5AA.attr('class','page-item')
                            idPagi5AA.html('<a class=\"page-link\" data-page='+(pageNowAA+2)+'>Next</a>')

                        }
                    })
                .catch(err =>{console.log(err)}
                )
            }
        })
        analogAlarmFilterTag.on('change', function(){
            valueOfFilterAA=this.value
            analogFilterAPI = 'http://localhost:8000/user/alarms/analog-data?filter='+valueOfFilterAA
            fetch(analogFilterAPI)
                .then((response) =>{
                    return response.json()
                })
                .then((data) => {
                    maxPageAA = data.shift()
                    var index = 0
                    var ordStart = 1
                    for(var j = 0; j<data.length;j++){
                        /* Set Ord */
                        thDataAA[j].innerText = ordStart++
                        /* */
                        for(var analogAlert in data[j]){
                            tdDataAA[index].innerText = data[j][analogAlert].toString()
                            index++
                        }
                        tdDataAA[index].innerText = ''
                        index++
                    }


                    /* fix bug not full */
                    if(data.length<5){
                        var ord = data.length*6 //number of col
                        for(var i = data.length; i < 5; i++){
                            thDataAA[i].innerText = 'null'
                            for(var j = 0; j<5; j++){
                                tdDataAA[ord].innerText = 'null'
                                ord++
                            }
                            tdDataAA[ord].innerText = ''
                            ord++
                        }
                    }
                    /* Re-initialize*/
                    idPagi1AA.attr('class','page-item disabled')
                    /**/
                    idPagi2AA.attr('class','page-item active')
                    idPagi2AA.html('<a class=\"page-link\" data-page=1>1<span class=\"sr-only\">(current)</span></a>')
                    /* */
                    idPagi3AA.attr('class','page-item')
                    idPagi3AA.html('<a class=\"page-link\" data-page=2>2</a>')
                    /* */
                    idPagi4AA.attr('class','page-item')
                    idPagi4AA.html('<a class=\"page-link\" data-page=3>3</a>')
                    /* */
                    idPagi5AA.attr('class','page-item')
                    idPagi5AA.html('<a class=\"page-link\" data-page=4>Next</a>')
                })
        })
    }
    /* Data table */
    else if(page.text() === 'Data Tables'){
        /* */
        var pagination = $('.datatable-pagination')
        var maxPage = parseInt(pagination.attr('data-maxpage'))
        var currentPage = parseInt(pagination.attr('data-page')) //not usage
        var phase = pagination.attr('data-phase')
        /* Initialize */
        pagination.html(
                    "<li id=\"id-pagination-1\" class=\"page-item disabled\"><a class=\"page-link\" data-page=0>Previous</a></li>"+
                    "<li id=\"id-pagination-2\" class=\"page-item active\"><a class=\"page-link\" data-page=1\">1</a></li>"+
                    "<li id=\"id-pagination-3\" class=\"page-item\"><a class=\"page-link\" data-page=2\">2<span class=\"sr-only\">(current)</span></a></li>"+
                    "<li id=\"id-pagination-4\" class=\"page-item\"><a class=\"page-link\" data-page=3\">3</a></li>"+
                    "<li id=\"id-pagination-5\" class=\"page-item\"><a class=\"page-link\" data-page=4\">Next</a></li>"
                )
        var tdData = $('#datatables tbody tr td')
        var thData = $('#datatables tbody tr th')
        var liFetch = $('.datatable-pagination li')
        /* Pagination li */
        var idPagi1 = $('#id-pagination-1')
        var idPagi2 = $('#id-pagination-2')
        var idPagi3 = $('#id-pagination-3')
        var idPagi4 = $('#id-pagination-4')
        var idPagi5 = $('#id-pagination-5')
        liFetch.on('click',function(e){
            if(!($(this).attr('class')==='page-item disabled')){
                pageNow = parseInt(e.target.dataset.page)
                dataAPI = 'http://localhost:8000/user/datatables/data?phase='+phase+'&page='+pageNow
                fetch(dataAPI)
                    .then((response)=> {
                        return response.json()
                    })
                    .then((data) => {
                        var index = 0
                        var ordStart = pageNow*10-9
                        for(var j = 0; j<data.length;j++){
                            /* */
                            if(phase === '2'){
                                delete data[j].KWH
                            }
                            else if (phase === '1'){
                                delete data[j].freq
                            }
                            /* Set Ord */
                            thData[j].innerText = ordStart++
                            // console.log(thData)
                            /* */
                            for(var selecData in data[j]){
                                if(selecData === 'timeStamp'){
                                    tdData[index].innerText = getTime(data[j][selecData])
                                }
                                else {
                                    tdData[index].innerText = data[j][selecData].toString()
                                }
                                index++
                            }
                        }
                        /* fix bug not full */
                        if(data.length<10){
                            var ord = data.length*8 //number of col
                            for(var i = data.length; i < 10; i++){
                                thData[i].innerText = 'null'
                                for(var j = 0; j<8; j++){
                                    tdData[ord].innerText = 'null'
                                    ord++
                                }
                            }
                        }
                        /* */
                        if(pageNow === 1){
                            idPagi1.attr('class','page-item disabled')
                            /**/
                            idPagi2.attr('class','page-item active')
                            idPagi2.html('<a class=\"page-link\" data-page='+pageNow+'>'+pageNow+'<span class=\"sr-only\">(current)</span></a>')
                            /* */
                            idPagi3.attr('class','page-item')
                            idPagi3.html('<a class=\"page-link\" data-page='+(pageNow+1)+'>'+(pageNow+1)+'</a>')
                            /* */
                            idPagi4.attr('class','page-item')
                            idPagi4.html('<a class=\"page-link\" data-page='+(pageNow+2)+'>'+(pageNow+2)+'</a>')
                            /* */
                            idPagi5.attr('class','page-item')
                            idPagi5.html('<a class=\"page-link\" data-page='+(pageNow+3)+'>Next</a>')
                        }
                        else if(pageNow === 2){
                            idPagi1.attr('class','page-item disabled')
                            /**/
                            idPagi2.attr('class','page-item')
                            idPagi2.html('<a class=\"page-link\" data-page='+(pageNow-1)+'>'+(pageNow-1)+'</a>')
                            /* */
                            idPagi3.attr('class','page-item active')
                            idPagi3.html('<a class=\"page-link\" data-page='+pageNow+'>'+pageNow+'<span class=\"sr-only\">(current)</span></a>')
                            /* */
                            idPagi4.attr('class','page-item')
                            idPagi4.html('<a class=\"page-link\" data-page='+(pageNow+1)+'>'+(pageNow+1)+'</a>')
                            /* */
                            idPagi5.attr('class','page-item')
                            idPagi5.html('<a class=\"page-link\" data-page='+(pageNow+2)+'>Next</a>')
                        }
                        else if(pageNow===(maxPage-1)){
                            idPagi1.attr('class','page-item')
                            idPagi1.html('<a class=\"page-link\" data-page='+(pageNow-2)+'>Previous</a>')
                            /**/
                            idPagi2.attr('class','page-item')
                            idPagi2.html('<a class=\"page-link\" data-page='+(pageNow-1)+'>'+(pageNow-1)+'</a>')
                            /* */
                            idPagi3.attr('class','page-item active')
                            idPagi3.html('<a class=\"page-link\" data-page='+pageNow+'>'+pageNow+'<span class=\"sr-only\">(current)</span></a>')
                            /* */
                            idPagi4.attr('class','page-item')
                            idPagi4.html('<a class=\"page-link\" data-page='+(pageNow+1)+'>'+(pageNow+1)+'</a>')
                            /* */
                            idPagi5.attr('class','page-item disabled')
                        }
                        else if(pageNow===maxPage){
                            idPagi1.attr('class','page-item')
                            idPagi1.html('<a class=\"page-link\" data-page='+(pageNow-3)+'>Previous</a>')
                            /**/
                            idPagi2.attr('class','page-item')
                            idPagi2.html('<a class=\"page-link\" data-page='+(pageNow-2)+'>'+(pageNow-2)+'</a>')
                            /* */
                            idPagi3.attr('class','page-item')
                            idPagi3.html('<a class=\"page-link\" data-page='+(pageNow-1)+'>'+(pageNow-1)+'</a>')
                            /* */
                            idPagi4.attr('class','page-item active')
                            idPagi4.html('<a class=\"page-link\" data-page='+pageNow+'>'+pageNow+'<span class=\"sr-only\">(current)</span></a>')
                            /* */
                            idPagi5.attr('class','page-item disabled')
                        }
                        else{
                            idPagi1.attr('class','page-item')
                            idPagi1.html('<a class=\"page-link\" data-page='+(pageNow-2)+'>Previous</a>')
                            /**/
                            idPagi2.attr('class','page-item')
                            idPagi2.html('<a class=\"page-link\" data-page='+(pageNow-1)+'>'+(pageNow-1)+'</a>')
                            /* */
                            idPagi3.attr('class','page-item active')
                            idPagi3.html('<a class=\"page-link\" data-page='+pageNow+'>'+pageNow+'<span class=\"sr-only\">(current)</span></a>')

                            /* */
                            idPagi4.attr('class','page-item')
                            idPagi4.html('<a class=\"page-link\" data-page='+(pageNow+1)+'>'+(pageNow+1)+'</a>')

                            /* */
                            idPagi5.attr('class','page-item')
                            idPagi5.html('<a class=\"page-link\" data-page='+(pageNow+2)+'>Next</a>')

                        }
                    }).catch(err => {console.log(err)})   
            } 
        })

        /* Export to Excel */
        var export2ExcelBtn = $('#export2excelBtn')
        export2ExcelBtn.on('click',function(e){
            var name
            if(phase === '0'){
                name = 'Summary Data'
            }
            else if(phase === '1'){
                name = 'Phase One'
            }
            else if(phase === '2'){
                name = 'Phase Two'
            }
            else {
                name = 'Phase Three'
            }
            var table2excel = new Table2Excel({defaultFileName: name});
            table2excel.export(document.querySelectorAll('#datatables'));
        })
    }
})

/* Get Tme */
function getTime(timeIn){
    time = new Date(timeIn)
    return `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()} ${time.getDate()}/${time.getMonth()+1}/${time.getFullYear()+100}`
}
/* Cloke Tme */
function getClockTime(time){
    time = new Date(time)
    return `CLOCK: ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
}
/* Check Role */
function isRole(role, right) {
    role = role.toLowerCase()
    if(role === right) {
        return true
    }
    return false
}

/* Update Sparkline */
function updateSparkline(arrayIn, value) {
    // console.log(Array.isArray(arrayIn))
    // console.log(value)
    arrayIn.shift()
    arrayIn.push(value)
    return arrayIn
}

function getData() {
    return Math.random()
}