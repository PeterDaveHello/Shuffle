import React, { useState, useEffect } from 'react';
import ReactGA from 'react-ga4';
import WelcomeForm2 from "../components/WelcomeForm2.jsx";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import AppFramework from "../components/AppFramework.jsx";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { 
	Grid, 
	Container,
  Fade,
	Typography, 
	Paper,
	Button,
	Card,
	CardContent,
	CardActionArea,
} from '@mui/material';
import theme from '../theme.jsx';
import { useNavigate, Link } from "react-router-dom";
import Drift from "react-driftjs";

const Welcome = (props) => {
    const { globalUrl, surfaceColor, newColor, mini, inputColor, userdata, isLoggedIn, isLoaded, serverside } = props;
    const [skipped, setSkipped] = React.useState(new Set());
    const [inputUsecase, setInputUsecase] = useState({});
  	const [frameworkData, setFrameworkData] = useState(undefined);
  	const [discoveryWrapper, setDiscoveryWrapper] = useState(undefined);
    const [activeStep, setActiveStep] = React.useState(1);
  	const [apps, setApps] = React.useState([]);
		const [defaultSearch, setDefaultSearch] = React.useState("")
		const [selectionOpen, setSelectionOpen] = React.useState(false)
		const [showWelcome, setShowWelcome] = React.useState(false)
  	const [usecases, setUsecases] = React.useState([]);
  	const [workflows, setWorkflows] = React.useState([]);

		let navigate = useNavigate();
    //if (serverside === false && isLoaded === true && isLoggedIn === false) {
		//	console.log("Redirecting to login?")
		//	console.log(window.location.pathname)
		//	console.log(window.location)
		//	navigate(`/login?view=${window.location.pathname}${window.location.search}`)
		//}

  	const isCloud =
			window.location.host === "localhost:3002" ||
			window.location.host === "shuffler.io";

		const [steps, setSteps] = useState([
			"Help us get to know you", 
			"Find your Apps", 
			"Discover Usecases",
		])


		const handleKeysetting = (categorydata, workflows) => {
			//workflows[0].category = ["detect"]
			//workflows[0].usecase_ids = ["Correlate tickets"]

			if (workflows !== undefined && workflows !== null) {
				var newcategories = []
				for (var key in categorydata) {
					var category = categorydata[key]
					category.matches = []

					for (var subcategorykey in category.list) {
						var subcategory = category.list[subcategorykey]
						subcategory.matches = []

						for (var workflowkey in workflows) {
							const workflow = workflows[workflowkey]

							if (workflow.usecase_ids !== undefined && workflow.usecase_ids !== null) {
								for (var usecasekey in workflow.usecase_ids) {

									if (workflow.usecase_ids[usecasekey].toLowerCase() === subcategory.name.toLowerCase()) {
										//console.log("Got match: ", workflow.usecase_ids[usecasekey])

										category.matches.push({
											"workflow": workflow.id,
											"category": subcategory.name,
										})
										subcategory.matches.push(workflow.id)
										break
									}
								}
							}

							if (subcategory.matches.length > 0) {
								break
							}
						}
					}

					newcategories.push(category)
				} 

				setUsecases(newcategories)
			} else {
				setUsecases(categorydata)
			}

			setWorkflows(workflows)
		}
  
		const fetchUsecases = (workflows) => {
			fetch(globalUrl + "/api/v1/workflows/usecases", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				credentials: "include",
			})
			.then((response) => {
				if (response.status !== 200) {
					console.log("Status not 200 for usecases");
				}

				return response.json()
			})
			.then((responseJson) => {
				if (responseJson.success !== false) {
					handleKeysetting(responseJson, workflows)
				} else {
					//setWorkflows(workflows);
					//setWorkflowDone(true);
				}
			})
			.catch((error) => {
				console.log("Usecase error: " + error.toString())
			});
		}

		const getAvailableWorkflows = () => {
			fetch(globalUrl + "/api/v1/workflows", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				credentials: "include",
			})
			.then((response) => {
				if (response.status !== 200) {
					console.log("Status not 200 for workflows :O!: ", response.status);
				}

				return response.json();
			})
			.then((responseJson) => {
				if (responseJson !== undefined) {
					var newarray = []
					for (var key in responseJson) {
						const wf = responseJson[key]
						if (wf.public === true) {
							continue
						}

						newarray.push(wf)
					}

					// Workflows are set in here
					fetchUsecases(newarray)
				}
			})
			.catch((error) => {
				console.log("err in get workflows: ", error.toString());
			})
		}

		const getFramework = () => {
			fetch(globalUrl + "/api/v1/apps/frameworkConfiguration", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				credentials: "include",
			})
			.then((response) => {
				if (response.status !== 200) {
					console.log("Status not 200 for framework!");
				}

				return response.json();
			})
			.then((responseJson) => {
				if (responseJson.success === false) {
					setFrameworkData({})

					if (responseJson.reason !== undefined) {
						//alert.error("Failed loading: " + responseJson.reason)
					} else {
						//alert.error("Failed to load framework for your org.")
					}
				} else {
					setFrameworkData(responseJson)
				}
			})
			.catch((error) => {
				console.log("err in framework: ", error.toString());
			})
		}

		const getApps = () => {
			fetch(globalUrl + "/api/v1/apps", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				credentials: "include",
			})
			.then((response) => {
				if (response.status !== 200) {
					console.log("Status not 200 for apps :O!");
				}

				return response.json();
			})
			.then((responseJson) => {
				setApps(responseJson);
			})
			.catch((error) => {
				console.log("App loading error: "+error.toString());
			});
		}

		const usecaseButtons = [{
			"name": "Phishing",
			"usecase": "Email management",
			"color": "#C51152",
		}, {
			"name": "Enrichment", 
			"usecase": "2. Enrich",
			"color": "#F4C20D",
		}, {
			"name": "Detection",
			"usecase": "3. Detect",
			"color": "#3CBA54",
		}, {
			"name": "Response",
			"usecase": "4. Respond",
			"color": "#4885ED",
		}]

		const handleSetSearch = (input, orgupdate) => {
			if (input !== defaultSearch) {
				setDefaultSearch(input)
				setSelectionOpen(false)
				setTimeout(function(){
					setSelectionOpen(true)
				}, 150);

				//if (userdata !== undefined && userdata.active_org !== undefined && userdata.active_org.id !== undefined) {
				//	sendOrgUpdate("", "", userdata.active_org.id, orgupdate) 
				//}
			} else {
				setDefaultSearch("")
				setSelectionOpen(false)
			}
		}

		useEffect(() => {
			getFramework() 
			getApps()
			getAvailableWorkflows() 

			if (
				window.location.search !== undefined &&
				window.location.search !== null
			) {
				const urlSearchParams = new URLSearchParams(window.location.search);
				const params = Object.fromEntries(urlSearchParams.entries());
				const foundTab = params["tab"];
				if (foundTab !== null && foundTab !== undefined && !isNaN(foundTab)) {
					setShowWelcome(true)
					if (foundTab === 3 || foundTab === "3") {
						handleSetSearch(usecaseButtons[0].name, usecaseButtons[0].usecase)
					}

					setActiveStep(foundTab-1)
				} else { 
    			//navigate(`/welcome?tab=1`)
    			navigate(`/welcome?tab=2`)
				}
			}
		}, [])

    const isStepSkipped = step => {
        return skipped.has(step)
    }

		const paperObject = {
			flex: 1, 
			padding: 0, 
			textAlign: "center",
			maxWidth: 300,
			minWidth: 300,
			backgroundColor: theme.palette.surfaceColor,
			color: "white",
			borderRadius: theme.palette.borderRadius,
		}

		const actionObject = {
			padding: "35px", 
			maxHeight: 300,
			minHeight: 300,
			borderRadius: theme.palette.borderRadius,
		}

		const imageStyle = {
			width: 150, 
			// height: 150, 
			// margin: "auto", 
			// marginTop: 10, 
			borderRadius: 75, 
			objectFit: "scale-down",
		}
		const buttonStyle = { 
			borderRadius: 8, 
			height: 51, 
			width: 464, 
			fontSize: 16, 
			background: "linear-gradient(89.83deg, #FF8444 0.13%, #F2643B 99.84%)", 
			padding: "16px 24px", 
			top: 75, 
			margin: "auto",
			itemAlign: "center",
		}

		const defaultImage = "/images/experienced.png"
		const experienced_image = userdata !== undefined && userdata !== null && userdata.active_org !== undefined && userdata.active_org.image !== undefined && userdata.active_org.image !== null && userdata.active_org.image !== "" ? userdata.active_org.image : defaultImage
    return (
				<div style={{width: 1000, margin: "auto", paddingBottom: 150, minHeight: 1500, marginTop: 50, }}>
					{/*
					<div style={{position: "fixed", bottom: 110, right: 110, display: "flex", }}>
						<img src="/images/Arrow.png" style={{width: 250, height: "100%",}} />
					</div>
					*/}
					{showWelcome === true ? 
						<div>
							<div style={{minWidth: 500, maxWidth: 500, margin: "auto", marginTop: isCloud ? "auto" : 20, }}>
								<Stepper 
									activeStep={activeStep} 
									color="primary"
									style={{
										backgroundColor: theme.palette.platformColor, 
										borderRadius: theme.palette.borderRadius, 
										padding: 12, 
										border: "1px solid rgba(255,255,255,0.3)", 
										maxWidth: 500, 
										color: "white",
									}}
								>
										{steps.map((label, index) => {
												const stepProps = {}
												const labelProps = {}
												//if (isStepOptional(index)) {
												//    labelProps.optional = "optional"
												//}

												if (isStepSkipped(index)) {
														stepProps.completed = false;
												}

												return (
														<Step key={label} {...stepProps} style={{maxWidth: 160, color: "white", }}>
															<StepLabel {...labelProps} style={{marginLeft: 10, color: "white",}}>
																{label}
															</StepLabel>
														</Step>
												)
										})}
								</Stepper>
							</div>
        			<Grid container spacing={2} style={{ padding: 0, maxWidth: 1000, minWidth: 1000, margin: "auto", }}>
          		  <Grid item xs={window.location.href.includes("tab=2") ? 6 : 12}>
									<div>
											{/*
											<WelcomeForm 
												userdata={userdata}
												globalUrl={globalUrl}
												discoveryWrapper={discoveryWrapper}
												setDiscoveryWrapper={setDiscoveryWrapper}
											/>
											*/}
											<WelcomeForm2
												userdata={userdata}
												globalUrl={globalUrl}
												discoveryWrapper={discoveryWrapper}
												setDiscoveryWrapper={setDiscoveryWrapper}
												appFramework={frameworkData}
												getFramework={getFramework}
												steps={steps}
												skipped={skipped}
												setSkipped={setSkipped}
												activeStep={activeStep}
												setActiveStep={setActiveStep}
												getApps={getApps}
												apps={apps}
												handleSetSearch={handleSetSearch}
												usecaseButtons={usecaseButtons}
												defaultSearch={defaultSearch}
												setDefaultSearch={setDefaultSearch}
												selectionOpen={selectionOpen}
												setSelectionOpen={setSelectionOpen}
											/>
									</div>
          		  </Grid>
								{frameworkData === undefined || window.location.href.includes("tab=1") || window.location.href.includes("tab=3") ? null :
									<div style={{marginTop: 25, }}>
										<Typography variant="h6" style={{textAlign: "center", marginBottom: 25, }}>
											App Framework
										</Typography>
										<Fade>
												<AppFramework
													inputUsecase={inputUsecase}
													frameworkData={frameworkData}
													setFrameworkData={setFrameworkData}
													selectedOption={"Draw"}
													showOptions={false}
													isLoaded={true}
													isLoggedIn={true}
													globalUrl={globalUrl}
													size={0.78}
													color={theme.palette.platformColor}
													discoveryWrapper={discoveryWrapper}
													setDiscoveryWrapper={setDiscoveryWrapper}
													apps={apps}
													inputUsecases={usecases}
													setInputUsecases={setUsecases}
												/>
										</Fade>
									</div>
								}
							</Grid>
						</div>
						: 
						<Fade in={true}>
							<div style={{maxWidth: 700, margin: "auto", marginTop: 50, }}>
								{/*
							<div style={{display:"flex"}}>
								<ArrowBackIosIcon style={{color: "#9E9E9E",}} onClick={() => {
										navigate("/login")
									}}/>
								<Typography variant="body1" style={{color: "#9E9E9E",textAlign: "center", marginBottom: 50, paddingRight: "366px"}} onClick={() => {
										navigate("/login")
									}}>
								Back
								</Typography>
							</div>
								*/}
								<Typography variant="h4" style={{color: "#F1F1F1", textAlign: "center", marginTop: 50, }}>
									Help us get to know you
								</Typography>
								<Typography variant="body1" style={{color: "#9E9E9E", textAlign: "center", marginBottom: 50,}}>
									We will use this information to personalize your automation
								</Typography>
								<div style={{display: "flex", marginTop: 70, width: 700, margin: "auto",}}>
									<div style={{border: "1px solid #806BFF", borderRadius: theme.palette.borderRadius, }}>
										<Card style={paperObject} onClick={() => {
											if (isCloud) {
													ReactGA.event({
														category: "welcome",
														action: "click_welcome_continue",
														label: "",
													})
											} else {
												//setActiveStep(1)
											}

											setShowWelcome(true)
										}}>
											<CardActionArea style={actionObject}>
												<img src="/images/welcome-to-shuffle.png" style={imageStyle} />
												<Typography variant="h4" style={{color: "#F1F1F1"}}> 
													New to Shuffle 
												</Typography>
												<Typography variant="body1" style={{marginTop: 10, color: "rgba(255,255,255,0.8)"}}>
														Let us guide you for an easier experience
												</Typography>
											</CardActionArea>
										</Card>
									</div>
									<div style={{marginLeft: 25, marginRight: 25, }}>
										{/* <Typography style={{marginTop: 200, }}>
											OR
										</Typography> */}
									</div>
									<Card style={paperObject} onClick={() => {
										if (isCloud) {
												ReactGA.event({
													category: "welcome",
													action: "click_getting_started",
													label: "",
												})
										}

										navigate("/workflows?message=Skipped intro")
									}}>
										<CardActionArea style={actionObject}>
											<img src={experienced_image} style={{padding: experienced_image === defaultImage ? 38 : 10, objectFit: "scale-down", minHeight: experienced_image === defaultImage ? 40 : 70, maxHeight: experienced_image === defaultImage ? 40 : 70, bordeRadius: theme.palette.borderRadius, }} />
											<Typography variant="h4" style={{color: "#F1F1F1"}}> 
												Experienced 
											</Typography>										
											<Typography variant="body1" style={{marginTop: 10, color: "rgba(255,255,255,0.8)"}}>
												Head to Shuffle right away
											</Typography>
										</CardActionArea>
									</Card>
								</div>

								{/*
								<div style={{display: "flex", flexDirection: "row", }}>
									<Button variant="contained" type="submit" fullWidth style={buttonStyle} onClick={() => {
										navigate("/workflows?message=Skipped intro continue")
									}}>
										Continue
									</Button>
								</div>
								*/}

								<div style={{margin: "auto", borderRadius: theme.palette.borderRadius, marginTop: 50, width: 200, overflow: "wrap", padding: 25, cursor: "pointer", }} onClick={() => {
									if (window.drift !== undefined) {
										window.drift.api.startInteraction({ interactionId: 340045 })
									} else {
										console.log("Couldn't find drift in window.drift and not .drift-open-chat with querySelector: ", window.drift)
									}
								}}>
									<Typography variant="body1" style={{margin: "auto", textAlign: "center"}}>
										Want a demo instead?
									</Typography>
								</div>
							</div>
						</Fade>
					}
			</div>
   ) 
}

export default Welcome; 
