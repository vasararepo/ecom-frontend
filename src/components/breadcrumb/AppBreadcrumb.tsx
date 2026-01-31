import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

type BreadcrumbItem = {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
};

type Props = {
  items: BreadcrumbItem[];
};

const AppBreadcrumb = ({ items }: Props) => {
  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      sx={{ mb: 2 }}
    >
      {items.map((item, index) => (
        <Chip
          key={index}
          label={item.label}
          icon={item.icon as any}
          clickable={!item.active}
          onClick={item.onClick}
          variant="outlined"
          sx={{
            height: 28,
            fontSize: 13,
            fontWeight: item.active ? 600 : 500,
            borderColor: "#e0e0e0",
            backgroundColor: item.active ? "#f5f7fa" : "#ffffff",
            color: item.active ? "#1e88e5" : "#555",
            cursor: item.active ? "default" : "pointer",

            "&:hover": {
              backgroundColor: item.active ? "#f5f7fa" : "#eef5ff",
            },

            "& .MuiChip-icon": {
              color: item.active ? "#1e88e5" : "#777",
            },
          }}
        />
      ))}
    </Breadcrumbs>
  );
};

export default AppBreadcrumb;
