 async function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }

async function login(page, url, my_id, my_pw) {
    try {
        console.log(`Navigating to ${url}...`)
        await page.goto("https://adonde.netlify.app")

        await page.goto(url)
        // console.log("page goto")
        let scrapedData = []

        //logging in through school authorization
        await page.waitForSelector('div.form-group.col-md-24')
        await page.type('#i0116', my_id, { delay: 100 })
        await page.waitForSelector('#idSIButton9')
        await page.focus('#idSIButton9')
        await page.click('#idSIButton9')

        await page.waitForSelector('div.form-group.col-md-24')
        await page.type('#i0118', my_pw)
        await page.waitFor(4000)
        //await page.waitForSelector('#idSIButton9');
        await page.focus('#idSIButton9')
        await page.click('#idSIButton9')
        // Wait for the required DOM to be rendered
                
        console.log(page.url())
                
        let page_dummy = await browser.newPage()
        await page_dummy.goto('https://www.google.com')
        await page_dummy.close()
        await delay(2000)
        let str = page.url()
        if (str.substring(str.length - 6) == "/login") {
            console.log("waiting triggered...")
            await delay(20000)
        }
        console.log(page.url())
        console.log("login successful")
    } catch (err) {
        console.log(err)
    }
}

async function scraper(browser, my_id, my_pw, my_type) {
    const gradescope_year = 'Spring 2021'
    const blackboard_year = 'SP21'
    const blackboard_course_query = '#toggle_other_' + blackboard_year
    try {
        if (my_type == "gradescope") {
            let url = 'https://www.gradescope.com/auth/saml/jhu'
            // let page = (await browser.pages())[0]
            var page = await browser.newPage()
            
            try {
                console.log(`Navigating to ${url}...`)
                // await page.goto("https://adonde.netlify.app")
        
                await page.goto(url)
                console.log("page goto")
                var scrapedData = []
        
                //logging in through school authorization
                await page.waitForSelector('div.form-group.col-md-24')
                await page.type('#i0116', my_id, { delay: 100 })
                await page.waitForSelector('#idSIButton9')
                await page.focus('#idSIButton9')
                await page.click('#idSIButton9')
        
                await page.waitForSelector('div.form-group.col-md-24')
                await page.type('#i0118', my_pw)
                await page.waitFor(4000)
                //await page.waitForSelector('#idSIButton9');
                await page.focus('#idSIButton9')
                await page.click('#idSIButton9')
                // Wait for the required DOM to be rendered
                        
                console.log(page.url())
                        
                let page_dummy = await browser.newPage()
                await page_dummy.goto('https://www.google.com')
                await page_dummy.close()
                await delay(2000)
                let str = page.url()
                if (str.substring(str.length - 6) == "/login") {
                    console.log("waiting triggered...")
                    await delay(20000)
                }
                console.log(page.url())
                console.log("login successful")
            } catch (err) {
                console.log(err)
            }

            console.log("logging in to gradescope")
 
            //in gradescope
            await page.waitForSelector('.courseList--coursesForTerm')

            // console.log("waitfor")

            let urls = await page.$$eval(
                'div.courseList > div:nth-child(2) > a',
                (links) => {
                    //has to be a course
                    links = links.filter((link) => link.className == 'courseBox')
                    //Extract the links from the data
                    links = links.map((el) => el.href)
                    return links
                }
            )
            // console.log("urls: ", urls)

            // console.log("eval")

            // Loop through each of those links, open a new page instance and get the relevant data from them
            let pagePromise = (link) =>
                new Promise(async (resolve, reject) => {
                    let dataObj = {}
                    let newPage = await browser.newPage()
                    await newPage.goto(link)
                    //check it is fall 2020 course
                    let verify = await newPage.$eval(
                        'main header > div',
                        (text) => text.textContent
                    )

                    if (verify == gradescope_year) {
                        let unconventional = await newPage.$eval(
                            'main header > h1',
                            (text) => text.textContent
                        )
                        let slash = unconventional.indexOf('/');
                        if (slash >= 0) {
                            unconventional = unconventional.substring(0, slash)
                        }
                        let conventional = unconventional.match(/\d/g).join("");

                        dataObj['courseName'] = conventional
                        dataObj['taskName'] = await newPage.$$eval(
                            'tbody > tr >th',
                            (names) => {
                                names = names.map((name) => name.textContent)
                                return names
                            }
                        )
                        dataObj['taskDue'] = await newPage.$$eval(
                            'tbody > tr > td > div > div > span',
                            (spans) => {
                                //has to be a due-date
                                spans = spans.filter(
                                    (span) =>
                                        span.className == 'submissionTimeChart--dueDate'
                                )
                                spans = spans.filter(
                                    (span) => span.textContent.substring(0, 4) != 'Late'
                                )
                                //Extract the links from the data
                                spans = spans.map((el) => el.textContent)
                                return spans
                            }
                        )
                        dataObj['taskBlob'] = 'scraped from gradescope - submit to gradescope'
                    }
                    resolve(dataObj)
                    reject(new Error("Request is failed"));
                    await newPage.close()
                })
            
            for (let link in urls) {
                let currentPageData = await pagePromise(urls[link])
                //let currentPageData = await pagePromise(link)
                //if empty not include in scraped data
                if (currentPageData != {}) {
                    console.log("currentPageData is not null")
                    scrapedData.push(currentPageData)
                    console.log("successfully pushed to scraped data")
                }
            }
            // console.log("end of links")
            //await page2.close()
            await page.close()
            return scrapedData
        }
        else if (my_type == "blackboard") {
            let url = 'https://blackboard.jhu.edu/webapps/login/sm/index.jsp?new_loc=/webapps/login'
            var page = await browser.newPage()
            try {
                console.log(`Navigating to ${url}...`)
        
                await page.goto(url)
                console.log("page goto")
                var scrapedData = []
        
                //logging in through school authorization
                await page.waitForSelector('div.form-group.col-md-24')
                await page.type('#i0116', my_id, { delay: 100 })
                await page.waitForSelector('#idSIButton9')
                await page.focus('#idSIButton9')
                await page.click('#idSIButton9')
        
                await page.waitForSelector('div.form-group.col-md-24')
                await page.type('#i0118', my_pw)
                await page.waitFor(4000)
                //await page.waitForSelector('#idSIButton9');
                await page.focus('#idSIButton9')
                await page.click('#idSIButton9')
                // Wait for the required DOM to be rendered
                        
                console.log(page.url())
                        
                let page_dummy = await browser.newPage()
                await page_dummy.goto('https://www.google.com')
                await page_dummy.close()
                await delay(2000)
                let str = page.url()
                if (str.substring(str.length - 6) == "/login") {
                    console.log("waiting triggered...")
                    await delay(5000)
                }
                console.log(page.url())
                console.log("login successful")
            } catch (err) {
                console.log(err)
            }
            console.log("logged into blackboard")

            //inside blackboard
            await page.waitForSelector('#loginBox-JHU')
            await page.click('#loginBox-JHU > h2 > a:nth-child(5)')
            console.log("click")
            //in blackboard
            //get course ids for select semester
            await page.waitForSelector(blackboard_course_query)
            let course_urls = await page.$$eval(
                blackboard_course_query + ' > tbody > tr > td > span > a ',
                (links) => {
                    links = links.map((el) => el.href)
                    return links
                }
            )

            console.log(course_urls)
            var course_ids = []
            for (let course_url of course_urls) {
                let c_index = course_url.indexOf("id=") + 3;
                let course_id = course_url.substring(c_index)
                course_ids.push(course_id)
            }

            console.log(course_ids);

            var urls = []
            for (let course_id of course_ids) {
                let link = "https://blackboard.jhu.edu/webapps/bb-mygrades-bb_bb60/myGrades?course_id="
                + course_id + "&stream_name=mygrades"
                urls.push(link)
            }
            let pagePromise = (link) =>
                new Promise(async (resolve, reject) => {
                    let dataObj = {}
                    let newPage = await browser.newPage()
                    await newPage.goto(link)
                    //check it has due dates => or else no point of scraping teh data
                    let verify = null;
                    try {
                        verify = await newPage.$eval(
                            'div.cell.gradable > div.activityType',
                            (text) => text.textContent
                        )
                    } catch (error) {
                        console.log(error)
                        // dataObj['courseName'] = "unsupported"
                    }
                    console.log("verify:" + verify);
                    if (verify && verify.indexOf('Due') >= 0) {
                        let unconventional = await newPage.$eval(
                            '#streamDetailHeaderRight > span.context',
                            (text) => text.textContent
                        )
                        console.log("unconventional:" + unconventional);
                        let slash = unconventional.indexOf(blackboard_year);
                        if (slash >= 0) {
                            unconventional = unconventional.substring(0, slash)
                        }
                        unconventional = unconventional.match(/\d/g).join("");
                        let conventional = unconventional.substring(0,6)
                        dataObj['courseName'] = conventional
                        dataObj['taskName'] = await newPage.$$eval(
                            'div.cell.gradable > a',
                            (names) => {
                                //has to have a matching due date
                                names = names.filter((name) => name.nextSibling.nextSibling.textContent.indexOf('Due') != -1)
                                names = names.map((name) => name.textContent)
                                return names
                            }
                        )
                        console.log("taskname:" + dataObj['taskName']);
                        dataObj['taskDue'] = await newPage.$$eval(
                            'div.cell.gradable > div.activityType',
                            (spans) => {
                                spans = spans.map((el) => el.textContent.trim())
                                return spans
                            }
                        )
                        console.log("taskdue:" + dataObj['taskDue']);
                        dataObj['taskBlob'] =
                            'scraped from blackboard - submit to blackboard'
                    }
                    resolve(dataObj)
                    await newPage.close()
                })
            for (let link in urls) {
                let currentPageData = await pagePromise(urls[link])
                //let currentPageData = await pagePromise(link)
                //if empty not include in scraped data
                if (currentPageData != {}) {
                    scrapedData.push(currentPageData)
                }
            }
            await page.close()
            console.log(scrapedData)
            return scrapedData
        }
    }
    catch(error){
        return null
    }
}

// module.exports = scraperObject;
// export default scraper
module.exports = scraper