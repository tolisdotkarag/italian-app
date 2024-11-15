import { useState, useEffect, useMemo } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useStore } from "../../store";
import { Box } from "@mui/material";

const pageSize = 10;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#3E505B",
    color: "#fefefe",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const ArrowIcon = ({ order }) => {
  return order === "desc" ? (
    <ArrowUpwardIcon
      sx={{
        position: "relative",
        top: "2px",
        width: "0.875rem",
        height: "0.875rem",
      }}
    />
  ) : (
    <ArrowDownwardIcon
      sx={{
        position: "relative",
        top: "2px",
        width: "0.875rem",
        height: "0.875rem",
      }}
    />
  );
};

export default function WordTable() {
  const words = useStore((store) => store.words);
  const getWords = useStore((store) => store.fetchWords);
  const sortWords = useStore((store) => store.sortWords);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState("italian");
  const [order, setOrder] = useState("asc");

  const rows = useMemo(() => {
    return words.slice(page * pageSize, (page + 1) * pageSize);
  }, [words, page]);

  useEffect(() => {
    if (words.length) return;
    getWords();
  }, [words, getWords]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const getDate = (date) => new Date(date).toLocaleDateString();
  const sortBy = (fltr) => {
    let ord = "asc";
    if (fltr === filter) {
      if (order === "asc") ord = "desc";
      else ord = "asc";
    }
    setOrder(ord);
    sortWords(fltr, ord);
    setFilter(fltr);
    setPage(0);
  };

  return (
    words.length !== 0 && (
      <Box sx={{ width: "100%", marginTop: "1rem" }}>
        <TableContainer
          component={Paper}
          sx={{
            maxWidth: "calc(100vw - 100px)",
            overflow: "auto",
          }}
        >
          <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <StyledTableCell
                  width={"15%"}
                  sx={{ cursor: "pointer" }}
                  onClick={() => sortBy("italian")}
                >
                  Italian
                  {filter === "italian" && <ArrowIcon order={order} />}
                </StyledTableCell>
                <StyledTableCell
                  align="right"
                  width={"15%"}
                  sx={{ cursor: "pointer" }}
                  onClick={() => sortBy("greek")}
                >
                  Greek
                  {filter === "greek" && <ArrowIcon order={order} />}
                </StyledTableCell>
                <StyledTableCell
                  align="right"
                  width={"15%"}
                  sx={{ cursor: "pointer" }}
                  onClick={() => sortBy("part_of_speech")}
                >
                  Type
                  {filter === "part_of_speech" && <ArrowIcon order={order} />}
                </StyledTableCell>
                <StyledTableCell align="right" width={"15%"}>
                  Gender
                </StyledTableCell>
                <StyledTableCell
                  align="right"
                  width={"10%"}
                  sx={{ cursor: "pointer" }}
                  onClick={() => sortBy("date_added")}
                >
                  Added on
                  {filter === "date_added" && <ArrowIcon order={order} />}
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((word) => (
                <StyledTableRow
                  key={word.docId}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <StyledTableCell component="th" scope="row">
                    {word.italianDisplay}
                  </StyledTableCell>
                  <StyledTableCell align="right">{word.greek}</StyledTableCell>
                  <StyledTableCell align="right">
                    {word.part_of_speech}
                  </StyledTableCell>
                  <StyledTableCell align="right">{word.gender}</StyledTableCell>
                  <StyledTableCell align="right">
                    {getDate(word.date_added)}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          rowsPerPageOptions={[]}
          count={words.length}
          rowsPerPage={pageSize}
          page={page}
          onPageChange={handleChangePage}
        />
      </Box>
    )
  );
}
