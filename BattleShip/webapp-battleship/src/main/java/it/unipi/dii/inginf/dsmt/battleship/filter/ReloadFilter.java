package it.unipi.dii.inginf.dsmt.battleship.filter;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;

@WebFilter(filterName = "ReloadFilter", urlPatterns = {"/pages/homepage.jsp"})
public class ReloadFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    /**
     * Checks if the user has already visited the homepage, useful to know if they have to be inserted in the
     * online users list or not.
     */
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        HttpSession session = request.getSession();

        if (session.getAttribute("numReloads") == null) {
            session.setAttribute("numReloads", 0);
        } else {
            session.setAttribute("numReloads", 1);
        }

        filterChain.doFilter(request, response);
    }

    public void destroy() {

    }
}