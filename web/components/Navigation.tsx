import {
  AppBar,
  Box,
  Button,
  MenuItem,
  Select,
  Stack,
  Toolbar,
} from "@mui/material";
import { useAccount } from "store/account";
import { ReactNode, useCallback } from "react";
import MetamaskIcon from "components/MetamaskIcon";
import { AiFillGithub } from "react-icons/ai";
import config from "utils/config";
import { getMetamask } from "utils/metamask";

type NavigationProps = {
  children: ReactNode;
};

export default function Navigation({ children }: NavigationProps) {
  const accountId = useAccount(useCallback((state) => state.accountId, []));
  const network = useAccount(useCallback((state) => state.network, []));

  // Change the network in metamask and store it.
  const onNetworkChange = useCallback(async (ev) => {
    const network = ev.target.value;

    const chainId =
      network === "mainnet" ? config.MAINNET_CHAIN_ID : config.TESTNET_CHAIN_ID;
    const metamask = await getMetamask();
    await metamask.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x" + chainId.toString(16) }],
    });
    useAccount.setState({
      network,
    });
  }, []);

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: "1px solid",
        borderColor: "grey.300",
      }}
    >
      <Toolbar sx={{ justifyContent: { xs: "center", md: "space-between" } }}>
        <Stack
          flex={1}
          alignItems="flex-start"
          sx={{
            display: { xs: "none", md: "flex" },
          }}
        >
          <Button
            component="a"
            href="https://github.com/pepsighan/giftnft.cards"
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
          >
            <Box sx={{ width: 18, height: 18, mr: 1 }}>
              <AiFillGithub size={18} />
            </Box>
            GitHub
          </Button>
        </Stack>

        {children}

        {accountId && (
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={2}
            flex={1}
            sx={{
              display: { xs: "none", md: "flex" },
            }}
          >
            <Select size="small" value={network} onChange={onNetworkChange}>
              <MenuItem value="mainnet">Andromeda Mainnet</MenuItem>
              <MenuItem value="testnet">Stardust Testnet</MenuItem>
            </Select>

            <Button>
              <Box sx={{ width: 18, height: 18, mr: 2 }}>
                <MetamaskIcon />
              </Box>
              {accountId.substring(0, 6)}...
              {accountId.substring(accountId.length - 4)}
            </Button>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
}
