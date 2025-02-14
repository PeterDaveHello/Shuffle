import React, { useEffect } from "react";

import { makeStyles } from "@material-ui/styles";
import { useTheme } from "@material-ui/core/styles";
import { useAlert } from "react-alert";

import {
  FormControl,
  InputLabel,
  Paper,
  OutlinedInput,
  Checkbox,
  Card,
  Tooltip,
  FormControlLabel,
  Typography,
  Switch,
  Select,
  MenuItem,
  Divider,
  TextField,
  Button,
  Tabs,
  Tab,
  Grid,
} from "@material-ui/core";

import IconButton from "@material-ui/core/IconButton";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SaveIcon from "@material-ui/icons/Save";

const useStyles = makeStyles({
  notchedOutline: {
    borderColor: "#f85a3e !important",
  },
});

const OrgHeaderexpanded = (props) => {
  const {
    userdata,
    selectedOrganization,
    setSelectedOrganization,
    globalUrl,
    isCloud,
		adminTab,
  } = props;

  const theme = useTheme();
  const alert = useAlert();
  const classes = useStyles();
  const defaultBranch = "master";

  const [orgName, setOrgName] = React.useState(selectedOrganization.name);
  const [orgDescription, setOrgDescription] = React.useState(
    selectedOrganization.description
  );

  const [appDownloadUrl, setAppDownloadUrl] = React.useState(
    selectedOrganization.defaults === undefined
      ? "https://github.com/frikky/shuffle-apps"
      : selectedOrganization.defaults.app_download_repo === undefined ||
        selectedOrganization.defaults.app_download_repo.length === 0
      ? "https://github.com/frikky/shuffle-apps"
      : selectedOrganization.defaults.app_download_repo
  );
  const [appDownloadBranch, setAppDownloadBranch] = React.useState(
    selectedOrganization.defaults === undefined
      ? defaultBranch
      : selectedOrganization.defaults.app_download_branch === undefined ||
        selectedOrganization.defaults.app_download_branch.length === 0
      ? defaultBranch
      : selectedOrganization.defaults.app_download_branch
  );
  const [workflowDownloadUrl, setWorkflowDownloadUrl] = React.useState(
    selectedOrganization.defaults === undefined
      ? "https://github.com/frikky/shuffle-apps"
      : selectedOrganization.defaults.workflow_download_repo === undefined ||
        selectedOrganization.defaults.workflow_download_repo.length === 0
      ? "https://github.com/frikky/shuffle-workflows"
      : selectedOrganization.defaults.workflow_download_repo
  );
  const [workflowDownloadBranch, setWorkflowDownloadBranch] = React.useState(
    selectedOrganization.defaults === undefined
      ? defaultBranch
      : selectedOrganization.defaults.workflow_download_branch === undefined ||
        selectedOrganization.defaults.workflow_download_branch.length === 0
      ? defaultBranch
      : selectedOrganization.defaults.workflow_download_branch
  );
  const [ssoEntrypoint, setSsoEntrypoint] = React.useState(
    selectedOrganization.sso_config === undefined
      ? ""
      : selectedOrganization.sso_config.sso_entrypoint === undefined ||
        selectedOrganization.sso_config.sso_entrypoint.length === 0
      ? ""
      : selectedOrganization.sso_config.sso_entrypoint
  );
  const [ssoCertificate, setSsoCertificate] = React.useState(
    selectedOrganization.sso_config === undefined
      ? ""
      : selectedOrganization.sso_config.sso_certificate === undefined ||
        selectedOrganization.sso_config.sso_certificate.length === 0
      ? ""
      : selectedOrganization.sso_config.sso_certificate
  );
  const [notificationWorkflow, setNotificationWorkflow] = React.useState(
    selectedOrganization.defaults === undefined
      ? ""
      : selectedOrganization.defaults.notification_workflow === undefined ||
        selectedOrganization.defaults.notification_workflow.length === 0
      ? ""
      : selectedOrganization.defaults.notification_workflow
  );

  const [documentationReference, setDocumentationReference] = React.useState(
    selectedOrganization.defaults === undefined
      ? ""
      : selectedOrganization.defaults.documentation_reference === undefined ||
        selectedOrganization.defaults.documentation_reference.length === 0
      ? ""
      : selectedOrganization.defaults.documentation_reference
  );
  const [openidClientId, setOpenidClientId] = React.useState(
    selectedOrganization.sso_config === undefined
      ? ""
      : selectedOrganization.sso_config.client_id === undefined ||
        selectedOrganization.sso_config.client_id.length === 0
      ? ""
      : selectedOrganization.sso_config.client_id
  );
  const [openidClientSecret, setOpenidClientSecret] = React.useState(
    selectedOrganization.sso_config === undefined
      ? ""
      : selectedOrganization.sso_config.client_secret === undefined ||
        selectedOrganization.sso_config.client_secret.length === 0
      ? ""
      : selectedOrganization.sso_config.client_secret
  );
  const [openidAuthorization, setOpenidAuthorization] = React.useState(
    selectedOrganization.sso_config === undefined
      ? ""
      : selectedOrganization.sso_config.openid_authorization === undefined ||
        selectedOrganization.sso_config.openid_authorization.length === 0
      ? ""
      : selectedOrganization.sso_config.openid_authorization
  );
  const [openidToken, setOpenidToken] = React.useState(
    selectedOrganization.sso_config === undefined
      ? ""
      : selectedOrganization.sso_config.openid_token === undefined ||
        selectedOrganization.sso_config.openid_token.length === 0
      ? ""
      : selectedOrganization.sso_config.openid_token
	)

  const handleEditOrg = (
    name,
    description,
    orgId,
    image,
    defaults,
    sso_config
  ) => {

    const data = {
      name: name,
      description: description,
      org_id: orgId,
      image: image,
      defaults: defaults,
      sso_config: sso_config,
    };

    const url = globalUrl + `/api/v1/orgs/${selectedOrganization.id}`;
    fetch(url, {
      mode: "cors",
      method: "POST",
      body: JSON.stringify(data),
      credentials: "include",
      crossDomain: true,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    })
      .then((response) =>
        response.json().then((responseJson) => {
          if (responseJson["success"] === false) {
            alert.error("Failed updating org: ", responseJson.reason);
          } else {
            alert.success("Successfully edited org!");
          }
        })
      )
      .catch((error) => {
        alert.error("Err: " + error.toString());
      });
  };

  const orgSaveButton = (
    <Tooltip title="Save any unsaved data" placement="bottom">
      <Button
        style={{ width: 150, height: 55, flex: 1 }}
        variant="contained"
        color="primary"
        disabled={
          userdata === undefined ||
          userdata === null ||
          userdata.admin !== "true"
        }
        onClick={() =>
          handleEditOrg(
            orgName,
            orgDescription,
            selectedOrganization.id,
            selectedOrganization.image,
            {
              app_download_repo: appDownloadUrl,
              app_download_branch: appDownloadBranch,
              workflow_download_repo: workflowDownloadUrl,
              workflow_download_branch: workflowDownloadBranch,
              notification_workflow: notificationWorkflow,
              documentation_reference: documentationReference,
            },
            {
              sso_entrypoint: ssoEntrypoint,
              sso_certificate: ssoCertificate,
              client_id: openidClientId,
              client_secret: openidClientSecret,
              openid_authorization: openidAuthorization,
              openid_token: openidToken,
            }
          )
        }
      >
        <SaveIcon />
      </Button>
    </Tooltip>
  );

	return (
		<div style={{ textAlign: "center" }}>
			<Grid container spacing={3} style={{ textAlign: "left" }}>
				<Grid item xs={12} style={{}}>
					<span>
						<Typography>Notification Workflow ID</Typography>
						<TextField
							required
							style={{
								flex: "1",
								marginTop: "5px",
								marginRight: "15px",
								backgroundColor: theme.palette.inputColor,
							}}
							fullWidth={true}
							type="name"
							id="outlined-with-placeholder"
							margin="normal"
							variant="outlined"
							placeholder="ID of the workflow to receive notifications"
							value={notificationWorkflow}
							onChange={(e) => {
								setNotificationWorkflow(e.target.value);
							}}
							InputProps={{
								classes: {
									notchedOutline: classes.notchedOutline,
								},
								style: {
									color: "white",
								},
							}}
						/>
					</span>
				</Grid> 
				<Grid item xs={12} style={{}}>
					<span>
						<Typography>Org Documentation reference</Typography>
						<TextField
							required
							style={{
								flex: "1",
								marginTop: "5px",
								marginRight: "15px",
								backgroundColor: theme.palette.inputColor,
							}}
							fullWidth={true}
							type="name"
							id="outlined-with-placeholder"
							margin="normal"
							variant="outlined"
							placeholder="URL to an external reference for this implementation"
							value={documentationReference}
							onChange={(e) => {
								setDocumentationReference(e.target.value);
							}}
							InputProps={{
								classes: {
									notchedOutline: classes.notchedOutline,
								},
								style: {
									color: "white",
								},
							}}
						/>
					</span>
				</Grid>
				{isCloud ? null : 
				<Grid item xs={12} style={{marginTop: 50 }}>
					<Typography variant="h4" style={{textAlign: "center",}}>OpenID connect</Typography>
					<Grid container style={{marginTop: 10, }}>
						<Grid item xs={6} style={{}}>
							<span>
								<Typography>Client ID</Typography>
								<TextField
									required
									style={{
										flex: "1",
										marginTop: "5px",
										marginRight: "15px",
										backgroundColor: theme.palette.inputColor,
									}}
									fullWidth={true}
									type="name"
									multiline={true}
									rows={2}
									disabled={
										selectedOrganization.manager_orgs !== undefined &&
										selectedOrganization.manager_orgs !== null &&
										selectedOrganization.manager_orgs.length > 0
									}
									id="outlined-with-placeholder"
									margin="normal"
									variant="outlined"
									placeholder="The OpenID client ID from the identity provider"
									value={openidClientId}
									onChange={(e) => {
										setOpenidClientId(e.target.value);
									}}
									InputProps={{
										classes: {
											notchedOutline: classes.notchedOutline,
										},
										style: {
											color: "white",
										},
									}}
								/>
							</span>
						</Grid>
						<Grid item xs={6} style={{}}>
							<span>
								<Typography>Client Secret (optional)</Typography>
								<TextField
									required
									style={{
										flex: "1",
										marginTop: "5px",
										marginRight: "15px",
										backgroundColor: theme.palette.inputColor,
									}}
									fullWidth={true}
									type="name"
									multiline={true}
									rows={2}
									disabled={
										selectedOrganization.manager_orgs !== undefined &&
										selectedOrganization.manager_orgs !== null &&
										selectedOrganization.manager_orgs.length > 0
									}
									id="outlined-with-placeholder"
									margin="normal"
									variant="outlined"
									placeholder="The OpenID client secret - DONT use this if dealing with implicit auth / PKCE"
									value={openidClientSecret}
									onChange={(e) => {
										setOpenidClientSecret(e.target.value);
									}}
									InputProps={{
										classes: {
											notchedOutline: classes.notchedOutline,
										},
										style: {
											color: "white",
										},
									}}
								/>
							</span>
						</Grid>
					</Grid>
					<Grid container style={{marginTop: 10, }}>
						<Grid item xs={6} style={{}}>
							<span>
								<Typography>Authorization URL</Typography>
								<TextField
									required
									style={{
										flex: "1",
										marginTop: "5px",
										marginRight: "15px",
										backgroundColor: theme.palette.inputColor,
									}}
									fullWidth={true}
									type="name"
									id="outlined-with-placeholder"
									margin="normal"
									variant="outlined"
									multiline={true}
									rows={2}
									placeholder="The OpenID authorization URL (usually ends with /authorize)"
									value={openidAuthorization}
									onChange={(e) => {
										setOpenidAuthorization(e.target.value)
									}}
									InputProps={{
										classes: {
											notchedOutline: classes.notchedOutline,
										},
										style: {
											color: "white",
										},
									}}
								/>
							</span>
						</Grid>
						<Grid item xs={6} style={{}}>
							<span>
								<Typography>Token URL</Typography>
								<TextField
									required
									style={{
										flex: "1",
										marginTop: "5px",
										marginRight: "15px",
										backgroundColor: theme.palette.inputColor,
									}}
									fullWidth={true}
									type="name"
									id="outlined-with-placeholder"
									margin="normal"
									variant="outlined"
									multiline={true}
									rows={2}
									placeholder="The OpenID token URL (usually ends with /token)"
									value={openidToken}
									onChange={(e) => {
										setOpenidToken(e.target.value)
									}}
									InputProps={{
										classes: {
											notchedOutline: classes.notchedOutline,
										},
										style: {
											color: "white",
										},
									}}
								/>
							</span>
						</Grid>
					</Grid>
				</Grid>
				}
				{/*isCloud ? null : */}
				<Grid item xs={12} style={{marginTop: 50,}}>
					<Typography variant="h4" style={{textAlign: "center",}}>SAML SSO (v1.1)</Typography>
					<Grid container style={{marginTop: 20, }}>
						<Grid item xs={6} style={{}}>
							<span>
								<Typography>SSO Entrypoint (IdP)</Typography>
								<TextField
									required
									style={{
										flex: "1",
										marginTop: "5px",
										marginRight: "15px",
										backgroundColor: theme.palette.inputColor,
									}}
									fullWidth={true}
									type="name"
									multiline={true}
									rows={2}
									disabled={
										selectedOrganization.manager_orgs !== undefined &&
										selectedOrganization.manager_orgs !== null &&
										selectedOrganization.manager_orgs.length > 0
									}
									id="outlined-with-placeholder"
									margin="normal"
									variant="outlined"
									placeholder="The entrypoint URL from your provider"
									value={ssoEntrypoint}
									onChange={(e) => {
										setSsoEntrypoint(e.target.value);
									}}
									InputProps={{
										classes: {
											notchedOutline: classes.notchedOutline,
										},
										style: {
											color: "white",
										},
									}}
								/>
							</span>
						</Grid>
						<Grid item xs={6} style={{}}>
							<span>
								<Typography>SSO Certificate (X509)</Typography>
								<TextField
									required
									style={{
										flex: "1",
										marginTop: "5px",
										marginRight: "15px",
										backgroundColor: theme.palette.inputColor,
									}}
									fullWidth={true}
									type="name"
									id="outlined-with-placeholder"
									margin="normal"
									variant="outlined"
									multiline={true}
									rows={2}
									placeholder="The X509 certificate to use"
									value={ssoCertificate}
									onChange={(e) => {
										setSsoCertificate(e.target.value);
									}}
									InputProps={{
										classes: {
											notchedOutline: classes.notchedOutline,
										},
										style: {
											color: "white",
										},
									}}
								/>
							</span>
						</Grid>
					</Grid>
					{isCloud ? 
						<Typography variant="body2" style={{textAlign: "left",}} color="textSecondary">
							IdP URL for Shuffle: https://shuffler.io/api/v1/login_sso
						</Typography>
					: null}
				</Grid>
				{isCloud ? null : (
					<Grid item xs={6} style={{}}>
						<span>
							<Typography>App Download URL</Typography>
							<TextField
								required
								style={{
									flex: "1",
									marginTop: "5px",
									marginRight: "15px",
									backgroundColor: theme.palette.inputColor,
								}}
								fullWidth={true}
								type="name"
								id="outlined-with-placeholder"
								margin="normal"
								variant="outlined"
								placeholder="A description for the organization"
								value={appDownloadUrl}
								onChange={(e) => {
									setAppDownloadUrl(e.target.value);
								}}
								InputProps={{
									classes: {
										notchedOutline: classes.notchedOutline,
									},
									style: {
										color: "white",
									},
								}}
							/>
						</span>
					</Grid>
				)}
				{isCloud ? null : (
					<Grid item xs={6} style={{}}>
						<span>
							<Typography>App Download Branch</Typography>
							<TextField
								required
								style={{
									flex: "1",
									marginTop: "5px",
									marginRight: "15px",
									backgroundColor: theme.palette.inputColor,
								}}
								fullWidth={true}
								type="name"
								id="outlined-with-placeholder"
								margin="normal"
								variant="outlined"
								placeholder="A description for the organization"
								value={appDownloadBranch}
								onChange={(e) => {
									setAppDownloadBranch(e.target.value);
								}}
								InputProps={{
									classes: {
										notchedOutline: classes.notchedOutline,
									},
									style: {
										color: "white",
									},
								}}
							/>
						</span>
					</Grid>
				)}
				{isCloud ? null : (
					<Grid item xs={6} style={{}}>
						<span>
							<Typography>Workflow Download URL</Typography>
							<TextField
								required
								style={{
									flex: "1",
									marginTop: "5px",
									marginRight: "15px",
									backgroundColor: theme.palette.inputColor,
								}}
								fullWidth={true}
								type="name"
								id="outlined-with-placeholder"
								margin="normal"
								variant="outlined"
								placeholder="A description for the organization"
								value={workflowDownloadUrl}
								onChange={(e) => {
									setWorkflowDownloadUrl(e.target.value);
								}}
								InputProps={{
									classes: {
										notchedOutline: classes.notchedOutline,
									},
									style: {
										color: "white",
									},
								}}
							/>
						</span>
					</Grid>
				)}
				{isCloud ? null : (
					<Grid item xs={6} style={{}}>
						<span>
							<Typography>Workflow Download Branch</Typography>
							<TextField
								required
								style={{
									flex: "1",
									marginTop: "5px",
									marginRight: "15px",
									backgroundColor: theme.palette.inputColor,
								}}
								fullWidth={true}
								type="name"
								id="outlined-with-placeholder"
								margin="normal"
								variant="outlined"
								placeholder="A description for the organization"
								value={workflowDownloadBranch}
								onChange={(e) => {
									setWorkflowDownloadBranch(e.target.value);
								}}
								InputProps={{
									classes: {
										notchedOutline: classes.notchedOutline,
									},
									style: {
										color: "white",
									},
								}}
							/>
						</span>
					</Grid>
				)}

				<div style={{ margin: "auto", textalign: "center", marginTop: 15, marginBottom: 15, }}>
					{orgSaveButton}
				</div>
				{/*
					<span style={{textAlign: "center"}}>
						{expanded ? 
							<ExpandLessIcon />
							:
							<ExpandMoreIcon />
						}
					</span>
					*/}
			</Grid>
		</div>
	)
}

export default OrgHeaderexpanded;