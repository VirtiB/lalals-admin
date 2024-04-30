import {
  Button,
  CircularProgress,
  SxProps,
  Theme,
  Tooltip,
} from "@mui/material";
import React from "react";

export interface ButtonProps {
  onClick?: (e: any) => void;
  isLoading?: boolean;
  variant: "contained" | "outlined" | "text";
  children?: React.ReactNode;
  type?: "submit" | "reset" | "button" | undefined;
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  loader?: boolean;
  className?: string;
  sx?: SxProps<Theme>;
  tooltipMessage?: string;
  style?: any;
}

const ButtonLoader = ({
  variant,
  children,
  onClick,
  color,
  size,
  isLoading,
  type,
  className,
  disabled = false,
  sx,
  style,
  ...props
}: ButtonProps) => {
  return (
    <div>
      <Button
        type={type}
        size={size}
        variant={variant}
        fullWidth
        style={style}
        sx={sx}
        color={color}
        disabled={disabled || isLoading}
        onClick={onClick}
        className={className}
        {...props}
      >
        {isLoading ? (
          <>
            <CircularProgress
              size={19}
              style={{
                position: "absolute",
                left: 10,
                transform: "translateY(-50%)",
                color: "#fff",
              }}
            />
            {children}{" "}
          </>
        ) : (
          children
        )}
      </Button>
    </div>
  );
};

export const ButtonWithTooltip = ({
  tooltipMessage,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <Tooltip title={disabled ? tooltipMessage : ""}>
      <div>
        <ButtonLoader {...props} disabled={disabled} />
      </div>
    </Tooltip>
  );
};

export default ButtonLoader;
