import { useAppDispatch } from "../../../../fetchConfig/store";

import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";

import { usePagination, DOTS } from "./usePagination";

import { SetPage } from "../../blogSlice";

import { useEffect } from "react";

import classes from "./Index.module.scss";

interface IProps {
  totalItemsCount: number;
  totalPages: number;
  currentPage: number;
  siblingCount?: number;
  itemsPerPage: number;
  className?: string | null;
}
const MyPagination = ({
  totalItemsCount,
  totalPages,
  currentPage,
  siblingCount = 1, // more on this later
  itemsPerPage = 10,
  className = null,
}: IProps) => {
  const paginationRange =
    usePagination({
      currentPage,
      totalItemsCount,
      siblingCount,
      itemsPerPage,
    }) || [];

  const dispatch = useAppDispatch();

  const setPage = (param: number) => dispatch(SetPage(param));

  useEffect(() => {
    // This useEffect will make set the active page to 1 if a user one way or the other enables the disabled buttons
    if (currentPage > totalPages || currentPage < 1) {
      setPage(1);
    }
  }, [currentPage, totalPages]);

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    setPage(currentPage + 1);
  };

  const onPrevious = () => {
    setPage(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    <div className={classes.Outer}>
      <ul className={`${classes.Container} ${className ? className : ""}`}>
        <BsFillArrowLeftCircleFill
          className={currentPage === 1 ? classes.Disabled : ""}
          onClick={onPrevious}
        />
        <div className={classes.Div}>
          {paginationRange.map((pageNumber) => {
            if (pageNumber === DOTS) {
              return (
                <li className={`${classes.Item} ${classes.Dots}`}>&#8230;</li>
              );
            }

            return (
              <li
                className={pageNumber === currentPage ? classes.Selected : ""}
                onClick={() => setPage(Number(pageNumber))}
                key={pageNumber}
              >
                {pageNumber}
              </li>
            );
          })}
        </div>
        <BsFillArrowRightCircleFill
          className={currentPage === lastPage ? classes.Disabled : ""}
          onClick={onNext}
        />
      </ul>
    </div>
  );
};

export default MyPagination;
