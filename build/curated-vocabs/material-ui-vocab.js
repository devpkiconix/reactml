"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:variable-name
const rtmlVocab_1 = require("../rtmlVocab");
const render_1 = require("../render");
const AppBar = render_1.asyncComponent("AppBar", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiAppBar' */ '@material-ui/core/AppBar')));
const Avatar = render_1.asyncComponent("Avatar", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiAvatar' */ '@material-ui/core/Avatar')));
const Backdrop = render_1.asyncComponent("Backdrop", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiBackdrop' */ '@material-ui/core/Backdrop')));
const Badge = render_1.asyncComponent("Badge", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiBadge' */ '@material-ui/core/Badge')));
const BottomNavigation = render_1.asyncComponent("BottomNavigation", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiBottomNavigation' */ '@material-ui/core/BottomNavigation')));
const BottomNavigationAction = render_1.asyncComponent("BottomNavigationAction", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiBottomNavigationAction' */ '@material-ui/core/BottomNavigationAction')));
const Button = render_1.asyncComponent("Button", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiButton' */ '@material-ui/core/Button')));
const ButtonBase = render_1.asyncComponent("ButtonBase", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiButtonBase' */ '@material-ui/core/ButtonBase')));
const Card = render_1.asyncComponent("Card", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiCard' */ '@material-ui/core/Card')));
const CardActionArea = render_1.asyncComponent("CardActionArea", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiCardActionArea' */ '@material-ui/core/CardActionArea')));
const CardActions = render_1.asyncComponent("CardActions", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiCardActions' */ '@material-ui/core/CardActions')));
const CardContent = render_1.asyncComponent("CardContent", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiCardContent' */ '@material-ui/core/CardContent')));
const CardHeader = render_1.asyncComponent("CardHeader", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiCardHeader' */ '@material-ui/core/CardHeader')));
const CardMedia = render_1.asyncComponent("CardMedia", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiCardMedia' */ '@material-ui/core/CardMedia')));
const Checkbox = render_1.asyncComponent("Checkbox", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiCheckbox' */ '@material-ui/core/Checkbox')));
const Chip = render_1.asyncComponent("Chip", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiChip' */ '@material-ui/core/Chip')));
const CircularProgress = render_1.asyncComponent("CircularProgress", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiCircularProgress' */ '@material-ui/core/CircularProgress')));
const ClickAwayListener = render_1.asyncComponent("ClickAwayListener", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiClickAwayListener' */ '@material-ui/core/ClickAwayListener')));
const Collapse = render_1.asyncComponent("Collapse", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiCollapse' */ '@material-ui/core/Collapse')));
const CssBaseline = render_1.asyncComponent("CssBaseline", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiCssBaseline' */ '@material-ui/core/CssBaseline')));
const Dialog = render_1.asyncComponent("Dialog", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiDialog' */ '@material-ui/core/Dialog')));
const DialogActions = render_1.asyncComponent("DialogActions", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiDialogActions' */ '@material-ui/core/DialogActions')));
const DialogContent = render_1.asyncComponent("DialogContent", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiDialogContent' */ '@material-ui/core/DialogContent')));
const DialogContentText = render_1.asyncComponent("DialogContentText", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiDialogContentText' */ '@material-ui/core/DialogContentText')));
const DialogTitle = render_1.asyncComponent("DialogTitle", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiDialogTitle' */ '@material-ui/core/DialogTitle')));
const Divider = render_1.asyncComponent("Divider", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiDivider' */ '@material-ui/core/Divider')));
const Drawer = render_1.asyncComponent("Drawer", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiDrawer' */ '@material-ui/core/Drawer')));
const ExpansionPanel = render_1.asyncComponent("ExpansionPanel", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiExpansionPanel' */ '@material-ui/core/ExpansionPanel')));
const ExpansionPanelActions = render_1.asyncComponent("ExpansionPanelActions", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiExpansionPanelActions' */ '@material-ui/core/ExpansionPanelActions')));
const ExpansionPanelDetails = render_1.asyncComponent("ExpansionPanelDetails", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiExpansionPanelDetails' */ '@material-ui/core/ExpansionPanelDetails')));
const ExpansionPanelSummary = render_1.asyncComponent("ExpansionPanelSummary", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiExpansionPanelSummary' */ '@material-ui/core/ExpansionPanelSummary')));
const Fade = render_1.asyncComponent("Fade", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiFade' */ '@material-ui/core/Fade')));
const FormControl = render_1.asyncComponent("FormControl", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiFormControl' */ '@material-ui/core/FormControl')));
const FormControlLabel = render_1.asyncComponent("FormControlLabel", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiFormControlLabel' */ '@material-ui/core/FormControlLabel')));
const FormGroup = render_1.asyncComponent("FormGroup", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiFormGroup' */ '@material-ui/core/FormGroup')));
const FormHelperText = render_1.asyncComponent("FormHelperText", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiFormHelperText' */ '@material-ui/core/FormHelperText')));
const FormLabel = render_1.asyncComponent("FormLabel", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiFormLabel' */ '@material-ui/core/FormLabel')));
const Grid = render_1.asyncComponent("Grid", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiGrid' */ '@material-ui/core/Grid')));
const GridList = render_1.asyncComponent("GridList", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiGridList' */ '@material-ui/core/GridList')));
const GridListTile = render_1.asyncComponent("GridListTile", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiGridListTile' */ '@material-ui/core/GridListTile')));
const GridListTileBar = render_1.asyncComponent("GridListTileBar", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiGridListTileBar' */ '@material-ui/core/GridListTileBar')));
const Grow = render_1.asyncComponent("Grow", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiGrow' */ '@material-ui/core/Grow')));
const Hidden = render_1.asyncComponent("Hidden", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiHidden' */ '@material-ui/core/Hidden')));
const Icon = render_1.asyncComponent("Icon", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiIcon' */ '@material-ui/core/Icon')));
const IconButton = render_1.asyncComponent("IconButton", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiIconButton' */ '@material-ui/core/IconButton')));
const Input = render_1.asyncComponent("Input", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiInput' */ '@material-ui/core/Input')));
const InputAdornment = render_1.asyncComponent("InputAdornment", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiInputAdornment' */ '@material-ui/core/InputAdornment')));
const InputLabel = render_1.asyncComponent("InputLabel", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiInputLabel' */ '@material-ui/core/InputLabel')));
const LinearProgress = render_1.asyncComponent("LinearProgress", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiLinearProgress' */ '@material-ui/core/LinearProgress')));
const List = render_1.asyncComponent("List", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiList' */ '@material-ui/core/List')));
const ListItem = render_1.asyncComponent("ListItem", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiListItem' */ '@material-ui/core/ListItem')));
const ListItemAvatar = render_1.asyncComponent("ListItemAvatar", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiListItemAvatar' */ '@material-ui/core/ListItemAvatar')));
const ListItemIcon = render_1.asyncComponent("ListItemIcon", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiListItemIcon' */ '@material-ui/core/ListItemIcon')));
const ListItemSecondaryAction = render_1.asyncComponent("ListItemSecondaryAction", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiListItemSecondaryAction' */ '@material-ui/core/ListItemSecondaryAction')));
const ListItemText = render_1.asyncComponent("ListItemText", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiListItemText' */ '@material-ui/core/ListItemText')));
const ListSubheader = render_1.asyncComponent("ListSubheader", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiListSubheader' */ '@material-ui/core/ListSubheader')));
const Menu = render_1.asyncComponent("Menu", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiMenu' */ '@material-ui/core/Menu')));
const MenuItem = render_1.asyncComponent("MenuItem", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiMenuItem' */ '@material-ui/core/MenuItem')));
const MenuList = render_1.asyncComponent("MenuList", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiMenuList' */ '@material-ui/core/MenuList')));
const MobileStepper = render_1.asyncComponent("MobileStepper", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiMobileStepper' */ '@material-ui/core/MobileStepper')));
const Modal = render_1.asyncComponent("Modal", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiModal' */ '@material-ui/core/Modal')));
const NativeSelect = render_1.asyncComponent("NativeSelect", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiNativeSelect' */ '@material-ui/core/NativeSelect')));
const NoSsr = render_1.asyncComponent("NoSsr", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiNoSsr' */ '@material-ui/core/NoSsr')));
const Paper = render_1.asyncComponent("Paper", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiPaper' */ '@material-ui/core/Paper')));
const Popover = render_1.asyncComponent("Popover", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiPopover' */ '@material-ui/core/Popover')));
const Popper = render_1.asyncComponent("Popper", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiPopper' */ '@material-ui/core/Popper')));
const Portal = render_1.asyncComponent("Portal", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiPortal' */ '@material-ui/core/Portal')));
const Radio = render_1.asyncComponent("Radio", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiRadio' */ '@material-ui/core/Radio')));
const RadioGroup = render_1.asyncComponent("RadioGroup", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiRadioGroup' */ '@material-ui/core/RadioGroup')));
const RootRef = render_1.asyncComponent("RootRef", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiRootRef' */ '@material-ui/core/RootRef')));
const Select = render_1.asyncComponent("Select", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiSelect' */ '@material-ui/core/Select')));
const Slide = render_1.asyncComponent("Slide", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiSlide' */ '@material-ui/core/Slide')));
const Snackbar = render_1.asyncComponent("Snackbar", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiSnackbar' */ '@material-ui/core/Snackbar')));
const SnackbarContent = render_1.asyncComponent("SnackbarContent", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiSnackbarContent' */ '@material-ui/core/SnackbarContent')));
const Step = render_1.asyncComponent("Step", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiStep' */ '@material-ui/core/Step')));
const StepButton = render_1.asyncComponent("StepButton", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiStepButton' */ '@material-ui/core/StepButton')));
const StepConnector = render_1.asyncComponent("StepConnector", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiStepConnector' */ '@material-ui/core/StepConnector')));
const StepContent = render_1.asyncComponent("StepContent", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiStepContent' */ '@material-ui/core/StepContent')));
const StepIcon = render_1.asyncComponent("StepIcon", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiStepIcon' */ '@material-ui/core/StepIcon')));
const StepLabel = render_1.asyncComponent("StepLabel", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiStepLabel' */ '@material-ui/core/StepLabel')));
const Stepper = render_1.asyncComponent("Stepper", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiStepper' */ '@material-ui/core/Stepper')));
const SvgIcon = render_1.asyncComponent("SvgIcon", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiSvgIcon' */ '@material-ui/core/SvgIcon')));
const SwipeableDrawer = render_1.asyncComponent("SwipeableDrawer", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiSwipeableDrawer' */ '@material-ui/core/SwipeableDrawer')));
const Switch = render_1.asyncComponent("Switch", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiSwitch' */ '@material-ui/core/Switch')));
const Tab = render_1.asyncComponent("Tab", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiTab' */ '@material-ui/core/Tab')));
const Table = render_1.asyncComponent("Table", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiTable' */ '@material-ui/core/Table')));
const TableBody = render_1.asyncComponent("TableBody", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiTableBody' */ '@material-ui/core/TableBody')));
const TableCell = render_1.asyncComponent("TableCell", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiTableCell' */ '@material-ui/core/TableCell')));
const TableFooter = render_1.asyncComponent("TableFooter", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiTableFooter' */ '@material-ui/core/TableFooter')));
const TableHead = render_1.asyncComponent("TableHead", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiTableHead' */ '@material-ui/core/TableHead')));
const TablePagination = render_1.asyncComponent("TablePagination", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiTablePagination' */ '@material-ui/core/TablePagination')));
// const TablePaginationActions asyncComponent "TablePaginationActions",AsyncHoc(() =>
// 	import( /* webpackChunkName: 'muiTablePaginationActions' */ '@material-ui/core/TablePaginationActions')
// );
const TableRow = render_1.asyncComponent("TableRow", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiTableRow' */ '@material-ui/core/TableRow')));
const TableSortLabel = render_1.asyncComponent("TableSortLabel", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiTableSortLabel' */ '@material-ui/core/TableSortLabel')));
const Tabs = render_1.asyncComponent("Tabs", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiTabs' */ '@material-ui/core/Tabs')));
const TextField = render_1.asyncComponent("TextField", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiTextField' */ '@material-ui/core/TextField')));
const Toolbar = render_1.asyncComponent("Toolbar", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiToolbar' */ '@material-ui/core/Toolbar')));
const Tooltip = render_1.asyncComponent("Tooltip", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiTooltip' */ '@material-ui/core/Tooltip')));
const Typography = render_1.asyncComponent("Typography", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiTypography' */ '@material-ui/core/Typography')));
const Zoom = render_1.asyncComponent("Zoom", () => Promise.resolve().then(() => require(/* webpackChunkName: 'muiZoom' */ '@material-ui/core/Zoom')));
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
    Paper,
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
exports.default = rtmlVocab_1.newVocab(tags);
//# sourceMappingURL=material-ui-vocab.js.map