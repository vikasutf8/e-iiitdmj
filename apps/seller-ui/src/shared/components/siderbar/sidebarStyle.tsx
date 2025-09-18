"use client"
import styled from 'styled-components'
// 8:13


export const SidebarWrapper = styled.div`
  background-color: var(--background);
  transition: transform 0.2s ease;
  height: 100%;
  position: fixed;
  transform: translateX(-100%);
  width: 16rem;
  flex-shrink: 0;
  z-index: 202;
  overflow-y: auto;
  border-right: 1px solid var(--border); 
  display: flex;
  flex-direction: column;
  padding: var(--space-10) var(--space-6);

  ::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    margin-left: 0;
    display: flex;
    position: static;
    height: 100vh;
    transform: translateX(0);
  }

  ${(props) =>
    (props as { collapsed?: boolean }).collapsed &&
    `
      display: inherit;
      margin-left: 0;
      transform: translateX(0);
    `}
`;


export const Overlay = styled.div`
  background-color: rgba(15, 23, 42, 0.3);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 201;
  transition: opacity 0.3s ease;
  opacity: 0.8;

  @media (min-width: 768px) {
    /* Update breakpoint as necessary */
    display: none;
    opacity: 1;
  }
`;

export const Header = styled.div`
  display: flex;
  gap: var(--space-8);
  align-items: center;
  padding-left: var(--space-10);
  padding-right: var(--space-10);
`;

export const Body= styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-10);
  margin-top: var(--space-13);
  padding-left: var(--space-4;
  padding-right: var(--space-4);
  overflow-y: auto;
`;


export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-12);
  padding: var(--space-18) var(--space-8) var(--space-8) var(--space-8);

  @media (min-width: 768px) {
    /* Update breakpoint as necessary */
    padding-top: 0;
    padding-bottom: 0;
  }
`;




export const SideBarStyle = {
  Wrappper :SidebarWrapper,
  Overlay,
  Header,
  Body,
  Footer,
}