// tslint:disable:variable-name
import { newVocab } from '../rtmlVocab';
import { asyncComponent } from "../render";

const AppBar = asyncComponent("AppBar", () =>
	import( /* webpackChunkName: 'muiAppBar' */ '@material-ui/core/AppBar')
);
const Avatar = asyncComponent("Avatar", () =>
	import( /* webpackChunkName: 'muiAvatar' */ '@material-ui/core/Avatar')
);
const Backdrop = asyncComponent("Backdrop", () =>
	import( /* webpackChunkName: 'muiBackdrop' */ '@material-ui/core/Backdrop')
);
const Badge = asyncComponent("Badge", () =>
	import( /* webpackChunkName: 'muiBadge' */ '@material-ui/core/Badge')
);
const BottomNavigation = asyncComponent("BottomNavigation", () =>
	import( /* webpackChunkName: 'muiBottomNavigation' */ '@material-ui/core/BottomNavigation')
);
const BottomNavigationAction = asyncComponent("BottomNavigationAction", () =>
	import( /* webpackChunkName: 'muiBottomNavigationAction' */ '@material-ui/core/BottomNavigationAction')
);
const Button = asyncComponent("Button", () =>
	import( /* webpackChunkName: 'muiButton' */ '@material-ui/core/Button')
);
const ButtonBase = asyncComponent("ButtonBase", () =>
	import( /* webpackChunkName: 'muiButtonBase' */ '@material-ui/core/ButtonBase')
);
const Card = asyncComponent("Card", () =>
	import( /* webpackChunkName: 'muiCard' */ '@material-ui/core/Card')
);
const CardActionArea = asyncComponent("CardActionArea", () =>
	import( /* webpackChunkName: 'muiCardActionArea' */ '@material-ui/core/CardActionArea')
);
const CardActions = asyncComponent("CardActions", () =>
	import( /* webpackChunkName: 'muiCardActions' */ '@material-ui/core/CardActions')
);
const CardContent = asyncComponent("CardContent", () =>
	import( /* webpackChunkName: 'muiCardContent' */ '@material-ui/core/CardContent')
);
const CardHeader = asyncComponent("CardHeader", () =>
	import( /* webpackChunkName: 'muiCardHeader' */ '@material-ui/core/CardHeader')
);
const CardMedia = asyncComponent("CardMedia", () =>
	import( /* webpackChunkName: 'muiCardMedia' */ '@material-ui/core/CardMedia')
);
const Checkbox = asyncComponent("Checkbox", () =>
	import( /* webpackChunkName: 'muiCheckbox' */ '@material-ui/core/Checkbox')
);
const Chip = asyncComponent("Chip", () =>
	import( /* webpackChunkName: 'muiChip' */ '@material-ui/core/Chip')
);
const CircularProgress = asyncComponent("CircularProgress", () =>
	import( /* webpackChunkName: 'muiCircularProgress' */ '@material-ui/core/CircularProgress')
);
const ClickAwayListener = asyncComponent("ClickAwayListener", () =>
	import( /* webpackChunkName: 'muiClickAwayListener' */ '@material-ui/core/ClickAwayListener')
);
const Collapse = asyncComponent("Collapse", () =>
	import( /* webpackChunkName: 'muiCollapse' */ '@material-ui/core/Collapse')
);
const CssBaseline = asyncComponent("CssBaseline", () =>
	import( /* webpackChunkName: 'muiCssBaseline' */ '@material-ui/core/CssBaseline')
);
const Dialog = asyncComponent("Dialog", () =>
	import( /* webpackChunkName: 'muiDialog' */ '@material-ui/core/Dialog')
);
const DialogActions = asyncComponent("DialogActions", () =>
	import( /* webpackChunkName: 'muiDialogActions' */ '@material-ui/core/DialogActions')
);
const DialogContent = asyncComponent("DialogContent", () =>
	import( /* webpackChunkName: 'muiDialogContent' */ '@material-ui/core/DialogContent')
);
const DialogContentText = asyncComponent("DialogContentText", () =>
	import( /* webpackChunkName: 'muiDialogContentText' */ '@material-ui/core/DialogContentText')
);
const DialogTitle = asyncComponent("DialogTitle", () =>
	import( /* webpackChunkName: 'muiDialogTitle' */ '@material-ui/core/DialogTitle')
);
const Divider = asyncComponent("Divider", () =>
	import( /* webpackChunkName: 'muiDivider' */ '@material-ui/core/Divider')
);
const Drawer = asyncComponent("Drawer", () =>
	import( /* webpackChunkName: 'muiDrawer' */ '@material-ui/core/Drawer')
);
const ExpansionPanel = asyncComponent("ExpansionPanel", () =>
	import( /* webpackChunkName: 'muiExpansionPanel' */ '@material-ui/core/ExpansionPanel')
);
const ExpansionPanelActions = asyncComponent("ExpansionPanelActions", () =>
	import( /* webpackChunkName: 'muiExpansionPanelActions' */ '@material-ui/core/ExpansionPanelActions')
);
const ExpansionPanelDetails = asyncComponent("ExpansionPanelDetails", () =>
	import( /* webpackChunkName: 'muiExpansionPanelDetails' */ '@material-ui/core/ExpansionPanelDetails')
);
const ExpansionPanelSummary = asyncComponent("ExpansionPanelSummary", () =>
	import( /* webpackChunkName: 'muiExpansionPanelSummary' */ '@material-ui/core/ExpansionPanelSummary')
);
const Fade = asyncComponent("Fade", () =>
	import( /* webpackChunkName: 'muiFade' */ '@material-ui/core/Fade')
);
const FormControl = asyncComponent("FormControl", () =>
	import( /* webpackChunkName: 'muiFormControl' */ '@material-ui/core/FormControl')
);
const FormControlLabel = asyncComponent("FormControlLabel", () =>
	import( /* webpackChunkName: 'muiFormControlLabel' */ '@material-ui/core/FormControlLabel')
);
const FormGroup = asyncComponent("FormGroup", () =>
	import( /* webpackChunkName: 'muiFormGroup' */ '@material-ui/core/FormGroup')
);
const FormHelperText = asyncComponent("FormHelperText", () =>
	import( /* webpackChunkName: 'muiFormHelperText' */ '@material-ui/core/FormHelperText')
);
const FormLabel = asyncComponent("FormLabel", () =>
	import( /* webpackChunkName: 'muiFormLabel' */ '@material-ui/core/FormLabel')
);
const Grid = asyncComponent("Grid", () =>
	import( /* webpackChunkName: 'muiGrid' */ '@material-ui/core/Grid')
);
const GridList = asyncComponent("GridList", () =>
	import( /* webpackChunkName: 'muiGridList' */ '@material-ui/core/GridList')
);
const GridListTile = asyncComponent("GridListTile", () =>
	import( /* webpackChunkName: 'muiGridListTile' */ '@material-ui/core/GridListTile')
);
const GridListTileBar = asyncComponent("GridListTileBar", () =>
	import( /* webpackChunkName: 'muiGridListTileBar' */ '@material-ui/core/GridListTileBar')
);
const Grow = asyncComponent("Grow", () =>
	import( /* webpackChunkName: 'muiGrow' */ '@material-ui/core/Grow')
);
const Hidden = asyncComponent("Hidden", () =>
	import( /* webpackChunkName: 'muiHidden' */ '@material-ui/core/Hidden')
);
const Icon = asyncComponent("Icon", () =>
	import( /* webpackChunkName: 'muiIcon' */ '@material-ui/core/Icon')
);
const IconButton = asyncComponent("IconButton", () =>
	import( /* webpackChunkName: 'muiIconButton' */ '@material-ui/core/IconButton')
);
const Input = asyncComponent("Input", () =>
	import( /* webpackChunkName: 'muiInput' */ '@material-ui/core/Input')
);
const InputAdornment = asyncComponent("InputAdornment", () =>
	import( /* webpackChunkName: 'muiInputAdornment' */ '@material-ui/core/InputAdornment')
);
const InputLabel = asyncComponent("InputLabel", () =>
	import( /* webpackChunkName: 'muiInputLabel' */ '@material-ui/core/InputLabel')
);
const LinearProgress = asyncComponent("LinearProgress", () =>
	import( /* webpackChunkName: 'muiLinearProgress' */ '@material-ui/core/LinearProgress')
);
const List = asyncComponent("List", () =>
	import( /* webpackChunkName: 'muiList' */ '@material-ui/core/List')
);
const ListItem = asyncComponent("ListItem", () =>
	import( /* webpackChunkName: 'muiListItem' */ '@material-ui/core/ListItem')
);
const ListItemAvatar = asyncComponent("ListItemAvatar", () =>
	import( /* webpackChunkName: 'muiListItemAvatar' */ '@material-ui/core/ListItemAvatar')
);
const ListItemIcon = asyncComponent("ListItemIcon", () =>
	import( /* webpackChunkName: 'muiListItemIcon' */ '@material-ui/core/ListItemIcon')
);
const ListItemSecondaryAction = asyncComponent("ListItemSecondaryAction", () =>
	import( /* webpackChunkName: 'muiListItemSecondaryAction' */ '@material-ui/core/ListItemSecondaryAction')
);
const ListItemText = asyncComponent("ListItemText", () =>
	import( /* webpackChunkName: 'muiListItemText' */ '@material-ui/core/ListItemText')
);
const ListSubheader = asyncComponent("ListSubheader", () =>
	import( /* webpackChunkName: 'muiListSubheader' */ '@material-ui/core/ListSubheader')
);
const Menu = asyncComponent("Menu", () =>
	import( /* webpackChunkName: 'muiMenu' */ '@material-ui/core/Menu')
);
const MenuItem = asyncComponent("MenuItem", () =>
	import( /* webpackChunkName: 'muiMenuItem' */ '@material-ui/core/MenuItem')
);
const MenuList = asyncComponent("MenuList", () =>
	import( /* webpackChunkName: 'muiMenuList' */ '@material-ui/core/MenuList')
);
const MobileStepper = asyncComponent("MobileStepper", () =>
	import( /* webpackChunkName: 'muiMobileStepper' */ '@material-ui/core/MobileStepper')
);
const Modal = asyncComponent("Modal", () =>
	import( /* webpackChunkName: 'muiModal' */ '@material-ui/core/Modal')
);
const NativeSelect = asyncComponent("NativeSelect", () =>
	import( /* webpackChunkName: 'muiNativeSelect' */ '@material-ui/core/NativeSelect')
);
const NoSsr = asyncComponent("NoSsr", () =>
	import( /* webpackChunkName: 'muiNoSsr' */ '@material-ui/core/NoSsr')
);
const Paper = asyncComponent("Paper", () =>
	import( /* webpackChunkName: 'muiPaper' */ '@material-ui/core/Paper')
);
const Popover = asyncComponent("Popover", () =>
	import( /* webpackChunkName: 'muiPopover' */ '@material-ui/core/Popover')
);
const Popper = asyncComponent("Popper", () =>
	import( /* webpackChunkName: 'muiPopper' */ '@material-ui/core/Popper')
);
const Portal = asyncComponent("Portal", () =>
	import( /* webpackChunkName: 'muiPortal' */ '@material-ui/core/Portal')
);
const Radio = asyncComponent("Radio", () =>
	import( /* webpackChunkName: 'muiRadio' */ '@material-ui/core/Radio')
);
const RadioGroup = asyncComponent("RadioGroup", () =>
	import( /* webpackChunkName: 'muiRadioGroup' */ '@material-ui/core/RadioGroup')
);
const RootRef = asyncComponent("RootRef", () =>
	import( /* webpackChunkName: 'muiRootRef' */ '@material-ui/core/RootRef')
);
const Select = asyncComponent("Select", () =>
	import( /* webpackChunkName: 'muiSelect' */ '@material-ui/core/Select')
);
const Slide = asyncComponent("Slide", () =>
	import( /* webpackChunkName: 'muiSlide' */ '@material-ui/core/Slide')
);
const Snackbar = asyncComponent("Snackbar", () =>
	import( /* webpackChunkName: 'muiSnackbar' */ '@material-ui/core/Snackbar')
);
const SnackbarContent = asyncComponent("SnackbarContent", () =>
	import( /* webpackChunkName: 'muiSnackbarContent' */ '@material-ui/core/SnackbarContent')
);
const Step = asyncComponent("Step", () =>
	import( /* webpackChunkName: 'muiStep' */ '@material-ui/core/Step')
);
const StepButton = asyncComponent("StepButton", () =>
	import( /* webpackChunkName: 'muiStepButton' */ '@material-ui/core/StepButton')
);
const StepConnector = asyncComponent("StepConnector", () =>
	import( /* webpackChunkName: 'muiStepConnector' */ '@material-ui/core/StepConnector')
);
const StepContent = asyncComponent("StepContent", () =>
	import( /* webpackChunkName: 'muiStepContent' */ '@material-ui/core/StepContent')
);
const StepIcon = asyncComponent("StepIcon", () =>
	import( /* webpackChunkName: 'muiStepIcon' */ '@material-ui/core/StepIcon')
);
const StepLabel = asyncComponent("StepLabel", () =>
	import( /* webpackChunkName: 'muiStepLabel' */ '@material-ui/core/StepLabel')
);
const Stepper = asyncComponent("Stepper", () =>
	import( /* webpackChunkName: 'muiStepper' */ '@material-ui/core/Stepper')
);
const SvgIcon = asyncComponent("SvgIcon", () =>
	import( /* webpackChunkName: 'muiSvgIcon' */ '@material-ui/core/SvgIcon')
);
const SwipeableDrawer = asyncComponent("SwipeableDrawer", () =>
	import( /* webpackChunkName: 'muiSwipeableDrawer' */ '@material-ui/core/SwipeableDrawer')
);
const Switch = asyncComponent("Switch", () =>
	import( /* webpackChunkName: 'muiSwitch' */ '@material-ui/core/Switch')
);
const Tab = asyncComponent("Tab", () =>
	import( /* webpackChunkName: 'muiTab' */ '@material-ui/core/Tab')
);
const Table = asyncComponent("Table", () =>
	import( /* webpackChunkName: 'muiTable' */ '@material-ui/core/Table')
);
const TableBody = asyncComponent("TableBody", () =>
	import( /* webpackChunkName: 'muiTableBody' */ '@material-ui/core/TableBody')
);
const TableCell = asyncComponent("TableCell", () =>
	import( /* webpackChunkName: 'muiTableCell' */ '@material-ui/core/TableCell')
);
const TableFooter = asyncComponent("TableFooter", () =>
	import( /* webpackChunkName: 'muiTableFooter' */ '@material-ui/core/TableFooter')
);
const TableHead = asyncComponent("TableHead", () =>
	import( /* webpackChunkName: 'muiTableHead' */ '@material-ui/core/TableHead')
);
const TablePagination = asyncComponent("TablePagination", () =>
	import( /* webpackChunkName: 'muiTablePagination' */ '@material-ui/core/TablePagination')
);

// const TablePaginationActions asyncComponent "TablePaginationActions",AsyncHoc(() =>
// 	import( /* webpackChunkName: 'muiTablePaginationActions' */ '@material-ui/core/TablePaginationActions')
// );
const TableRow = asyncComponent("TableRow", () =>
	import( /* webpackChunkName: 'muiTableRow' */ '@material-ui/core/TableRow')
);
const TableSortLabel = asyncComponent("TableSortLabel", () =>
	import( /* webpackChunkName: 'muiTableSortLabel' */ '@material-ui/core/TableSortLabel')
);
const Tabs = asyncComponent("Tabs", () =>
	import( /* webpackChunkName: 'muiTabs' */ '@material-ui/core/Tabs')
);
const TextField = asyncComponent("TextField", () =>
	import( /* webpackChunkName: 'muiTextField' */ '@material-ui/core/TextField')
);
const Toolbar = asyncComponent("Toolbar", () =>
	import( /* webpackChunkName: 'muiToolbar' */ '@material-ui/core/Toolbar')
);
const Tooltip = asyncComponent("Tooltip", () =>
	import( /* webpackChunkName: 'muiTooltip' */ '@material-ui/core/Tooltip')
);
const Typography = asyncComponent("Typography", () =>
	import( /* webpackChunkName: 'muiTypography' */ '@material-ui/core/Typography')
);
const Zoom = asyncComponent("Zoom", () =>
	import( /* webpackChunkName: 'muiZoom' */ '@material-ui/core/Zoom')
);

const tags = {
	AppBar,
	Avatar,
	Backdrop,
	Badge,
	BottomNavigation,
	BottomNavigationAction,
	Button,
	ButtonBase,
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardHeader,
	CardMedia,
	Checkbox,
	Chip,
	CircularProgress,
	ClickAwayListener,
	Collapse,
	CssBaseline,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	Drawer,
	ExpansionPanel,
	ExpansionPanelActions,
	ExpansionPanelDetails,
	ExpansionPanelSummary,
	Fade,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormHelperText,
	FormLabel,
	Grid,
	GridList,
	GridListTile,
	GridListTileBar,
	Grow,
	Hidden,
	Icon,
	IconButton,
	Input,
	InputAdornment,
	InputLabel,
	LinearProgress,
	List,
	ListItem,
	ListItemAvatar,
	ListItemIcon,
	ListItemSecondaryAction,
	ListItemText,
	ListSubheader,
	Menu,
	MenuItem,
	MenuList,
	MobileStepper,
	Modal,
	NativeSelect,
	NoSsr,
	Paper,// : asyncComponent(() => import('@material-ui/core/Paper')),
	Popover,
	Popper,
	Portal,
	Radio,
	RadioGroup,
	RootRef,
	Select,
	Slide,
	Snackbar,
	SnackbarContent,
	Step,
	StepButton,
	StepConnector,
	StepContent,
	StepIcon,
	StepLabel,
	Stepper,
	SvgIcon,
	SwipeableDrawer,
	Switch,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TablePagination,
	TablePaginationActions,
	TableRow,
	TableSortLabel,
	Tabs,
	TextField,
	Toolbar,
	Tooltip,
	Typography,
	Zoom,
};

// tslint:disable-next-line:no-default-export
export default newVocab(tags);
