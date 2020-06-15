import {createAction} from '@reduxjs/toolkit';

export const moveBuilder = createAction('MOVE_BUILDER');

export const buildBlock = createAction('BUILD_BLOCK');

export const selectBuilder = createAction('SELECT_BUILDER');

export const unselectBuilder = createAction('UNSELECT_BUILDER');

export const setUpBuilder = createAction('SET_UP_BUILDER');
